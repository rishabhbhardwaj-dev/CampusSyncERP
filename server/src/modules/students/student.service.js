const prisma = require('../../config/db');
const bcrypt = require('bcryptjs');
const ApiError = require('../../utils/apiError');

class StudentService {
  async getAllStudents(query) {
    const { search, department, semester, course, page = 1, limit = 10 } = query;

    const where = { user: { role: 'STUDENT' } };

    if (search) {
      where.OR = [
        { user: { name: { contains: search } } },
        { user: { email: { contains: search } } },
        { enrollmentNo: { contains: search } },
      ];
    }

    if (department) where.user = { ...where.user, departmentId: parseInt(department) };
    if (semester) where.semester = parseInt(semester);
    if (course) where.courseId = parseInt(course);

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true, phone: true, avatar: true, isActive: true, departmentId: true, department: { select: { name: true, code: true } } },
          },
          course: { select: { name: true, code: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.student.count({ where }),
    ]);

    const formatted = students.map((s) => ({
      id: s.id,
      userId: s.userId,
      name: s.user.name,
      email: s.user.email,
      phone: s.user.phone,
      avatar: s.user.avatar,
      isActive: s.user.isActive,
      enrollmentNo: s.enrollmentNo,
      semester: s.semester,
      section: s.section,
      admissionYear: s.admissionYear,
      guardianName: s.guardianName,
      guardianPhone: s.guardianPhone,
      department: s.user.department?.name || 'N/A',
      departmentCode: s.user.department?.code || '',
      departmentId: s.user.departmentId,
      course: s.course?.name || 'N/A',
      courseCode: s.course?.code || '',
      courseId: s.courseId,
      createdAt: s.createdAt,
    }));

    return {
      data: formatted,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    };
  }

  async getStudentById(id) {
    const student = await prisma.student.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true, avatar: true, isActive: true, department: { select: { name: true, code: true } } } },
        course: { select: { name: true, code: true } },
        attendances: { take: 10, orderBy: { date: 'desc' } },
        marks: { include: { subject: { select: { name: true, code: true } } } },
        fees: { orderBy: { dueDate: 'desc' } },
      },
    });

    if (!student) throw new ApiError(404, 'Student not found.');
    return student;
  }

  async createStudent(data) {
    const { name, email, phone, password, departmentId, enrollmentNo, courseId, semester, section, admissionYear, guardianName, guardianPhone } = data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new ApiError(409, 'A user with this email already exists.');

    const existingEnrollment = await prisma.student.findUnique({ where: { enrollmentNo } });
    if (existingEnrollment) throw new ApiError(409, 'This enrollment number is already taken.');

    const hashedPassword = await bcrypt.hash(password || 'student123', 10);

    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          phone: phone || null,
          role: 'STUDENT',
          departmentId: departmentId ? parseInt(departmentId) : null,
        },
      });

      const student = await tx.student.create({
        data: {
          userId: user.id,
          enrollmentNo,
          courseId: parseInt(courseId),
          semester: parseInt(semester) || 1,
          section: section || null,
          admissionYear: parseInt(admissionYear) || new Date().getFullYear(),
          guardianName: guardianName || null,
          guardianPhone: guardianPhone || null,
        },
        include: {
          user: { select: { name: true, email: true, phone: true, department: { select: { name: true } } } },
          course: { select: { name: true, code: true } },
        },
      });

      return student;
    });
  }

  async updateStudent(id, data) {
    const { name, email, phone, departmentId, enrollmentNo, courseId, semester, section, guardianName, guardianPhone, isActive } = data;

    const student = await prisma.student.findUnique({ where: { id: parseInt(id) }, include: { user: true } });
    if (!student) throw new ApiError(404, 'Student not found.');

    if (email && email !== student.user.email) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) throw new ApiError(409, 'Email already in use.');
    }

    if (enrollmentNo && enrollmentNo !== student.enrollmentNo) {
      const existing = await prisma.student.findUnique({ where: { enrollmentNo } });
      if (existing) throw new ApiError(409, 'Enrollment number already in use.');
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: student.userId },
        data: {
          ...(name && { name }),
          ...(email && { email }),
          ...(phone !== undefined && { phone }),
          ...(departmentId !== undefined && { departmentId: departmentId ? parseInt(departmentId) : null }),
          ...(isActive !== undefined && { isActive }),
        },
      });

      await tx.student.update({
        where: { id: parseInt(id) },
        data: {
          ...(enrollmentNo && { enrollmentNo }),
          ...(courseId && { courseId: parseInt(courseId) }),
          ...(semester && { semester: parseInt(semester) }),
          ...(section !== undefined && { section }),
          ...(guardianName !== undefined && { guardianName }),
          ...(guardianPhone !== undefined && { guardianPhone }),
        },
      });
    });

    return await prisma.student.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: { select: { name: true, email: true, phone: true, isActive: true, department: { select: { name: true } } } },
        course: { select: { name: true, code: true } },
      },
    });
  }

  async deleteStudent(id) {
    const student = await prisma.student.findUnique({ where: { id: parseInt(id) } });
    if (!student) throw new ApiError(404, 'Student not found.');

    await prisma.user.delete({ where: { id: student.userId } });
    return true;
  }

  async getStats() {
    const [total, bySemester, byDepartment] = await Promise.all([
      prisma.student.count(),
      prisma.student.groupBy({ by: ['semester'], _count: true, orderBy: { semester: 'asc' } }),
      prisma.user.groupBy({
        by: ['departmentId'],
        where: { role: 'STUDENT', departmentId: { not: null } },
        _count: true,
      }),
    ]);

    const departments = await prisma.department.findMany({ select: { id: true, name: true, code: true } });
    const deptMap = Object.fromEntries(departments.map((d) => [d.id, d]));

    return {
      total,
      bySemester: bySemester.map((s) => ({ semester: s.semester, count: s._count })),
      byDepartment: byDepartment.map((d) => ({
        department: deptMap[d.departmentId]?.name || 'Unknown',
        code: deptMap[d.departmentId]?.code || '',
        count: d._count,
      })),
    };
  }
}

module.exports = new StudentService();
