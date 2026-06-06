const prisma = require('../../config/db');
const { ApiError } = require('../../utils/apiError');
const bcrypt = require('bcryptjs');

/**
 * @desc    Get all faculty members
 * @route   GET /api/faculty
 * @access  Private (Admin only)
 */
exports.getAllFaculty = async (req, res, next) => {
  try {
    const { search, departmentId, page = 1, limit = 10 } = req.query;
    
    // Build query conditions
    const where = {};
    if (departmentId) where.departmentId = parseInt(departmentId);
    if (search) {
      where.OR = [
        { user: { name: { contains: search } } },
        { user: { email: { contains: search } } },
        { employeeId: { contains: search } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [faculty, total] = await Promise.all([
      prisma.faculty.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true, phone: true, departmentId: true, department: true }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.faculty.count({ where })
    ]);

    res.status(200).json({
      success: true,
      data: faculty,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new faculty member
 * @route   POST /api/faculty
 * @access  Private (Admin only)
 */
exports.createFaculty = async (req, res, next) => {
  try {
    const {
      name, email, phone, departmentId,
      employeeId, designation, qualification, joiningDate, password
    } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ApiError('Email is already registered', 400);
    }

    // Check if employeeId exists
    const existingFaculty = await prisma.faculty.findUnique({ where: { employeeId } });
    if (existingFaculty) {
      throw new ApiError('Employee ID already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(password || 'faculty123', 10);

    // Create user and faculty in a transaction
    const newFaculty = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          phone,
          role: 'FACULTY',
          departmentId: departmentId ? parseInt(departmentId) : null
        }
      });

      return tx.faculty.create({
        data: {
          userId: user.id,
          employeeId,
          designation,
          qualification,
          joiningDate: new Date(joiningDate)
        },
        include: {
          user: {
            select: { id: true, name: true, email: true, phone: true, departmentId: true, department: true }
          }
        }
      });
    });

    res.status(201).json({
      success: true,
      data: newFaculty,
      message: 'Faculty created successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete faculty member
 * @route   DELETE /api/faculty/:id
 * @access  Private (Admin only)
 */
exports.deleteFaculty = async (req, res, next) => {
  try {
    const { id } = req.params;

    const faculty = await prisma.faculty.findUnique({ where: { id } });
    if (!faculty) {
      throw new ApiError('Faculty not found', 404);
    }

    // Delete user (cascade will delete faculty record)
    await prisma.user.delete({
      where: { id: faculty.userId }
    });

    res.status(200).json({
      success: true,
      message: 'Faculty deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
