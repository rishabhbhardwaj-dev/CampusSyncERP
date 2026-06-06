// ─── Auth Service ───────────────────────────────────────────
// Purpose: Contains the BUSINESS LOGIC for authentication.
// Why separate from controller? Controllers handle HTTP (req/res).
//   Services handle logic (hashing, token generation, DB queries).
//   This separation means:
//   - Services can be reused (e.g., called from a seed script)
//   - Services are easier to unit test (no HTTP mocking needed)
//   - Controllers stay thin and focused on request/response

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../../config/db');
const env = require('../../config/env');
const ApiError = require('../../utils/apiError');

class AuthService {
  // Hash password with bcrypt (10 salt rounds is the industry standard)
  async hashPassword(password) {
    return bcrypt.hash(password, 10);
  }

  // Compare plain text password with hashed one from DB
  async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  // Generate JWT token containing user ID and role
  // This token is what gets stored in the cookie
  generateToken(user) {
    return jwt.sign(
      { id: user.id, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );
  }

  // ─── Register a new user ─────────────────────────────────
  // Only admins can register users (enforced in routes via RBAC middleware).
  // Creates the User record + the role-specific record (Student or Faculty).
  async register(data) {
    const { email, password, name, phone, role, departmentId, ...profileData } = data;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ApiError(409, 'Email already registered.');
    }

    const hashedPassword = await this.hashPassword(password);

    // Use a transaction to create User + Student/Faculty atomically
    // If either fails, both are rolled back
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          phone,
          role,
          departmentId: departmentId || null,
        },
      });

      // Create role-specific profile
      if (role === 'STUDENT') {
        await tx.student.create({
          data: {
            userId: newUser.id,
            enrollmentNo: profileData.enrollmentNo,
            courseId: profileData.courseId,
            semester: profileData.semester || 1,
            section: profileData.section,
            admissionYear: profileData.admissionYear || new Date().getFullYear(),
            guardianName: profileData.guardianName,
            guardianPhone: profileData.guardianPhone,
          },
        });
      } else if (role === 'FACULTY') {
        await tx.faculty.create({
          data: {
            userId: newUser.id,
            employeeId: profileData.employeeId,
            designation: profileData.designation,
            qualification: profileData.qualification,
            joiningDate: profileData.joiningDate ? new Date(profileData.joiningDate) : null,
          },
        });
      }

      return newUser;
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // ─── Login ────────────────────────────────────────────────
  async login(email, password) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        student: true,
        faculty: true,
        department: { select: { id: true, name: true, code: true } },
      },
    });

    if (!user) {
      throw new ApiError(401, 'Invalid email or password.');
    }

    if (!user.isActive) {
      throw new ApiError(403, 'Account has been deactivated. Contact admin.');
    }

    const isPasswordValid = await this.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid email or password.');
    }

    const token = this.generateToken(user);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  // ─── Get current user profile ─────────────────────────────
  async getProfile(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: { include: { course: true } },
        faculty: true,
        department: { select: { id: true, name: true, code: true } },
      },
    });

    if (!user) {
      throw new ApiError(404, 'User not found.');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // ─── Change password ──────────────────────────────────────
  async changePassword(userId, currentPassword, newPassword) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new ApiError(404, 'User not found.');
    }

    const isPasswordValid = await this.comparePassword(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new ApiError(400, 'Current password is incorrect.');
    }

    const hashedPassword = await this.hashPassword(newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }
}

module.exports = new AuthService();
