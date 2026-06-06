const prisma = require('../../config/db');

exports.getDepartments = async (req, res, next) => {
  try {
    const departments = await prisma.department.findMany({
      include: {
        _count: {
          select: { courses: true, faculty: true }
        }
      }
    });
    res.status(200).json({ success: true, data: departments });
  } catch (error) {
    next(error);
  }
};

exports.getCourses = async (req, res, next) => {
  try {
    const { departmentId } = req.query;
    const where = departmentId ? { departmentId: parseInt(departmentId) } : {};
    
    const courses = await prisma.course.findMany({
      where,
      include: {
        department: { select: { id: true, name: true, code: true } },
        _count: { select: { students: true, subjects: true } }
      }
    });
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    next(error);
  }
};

exports.getSubjects = async (req, res, next) => {
  try {
    const { courseId, semester } = req.query;
    const where = {};
    if (courseId) where.courseId = parseInt(courseId);
    if (semester) where.semester = parseInt(semester);

    const subjects = await prisma.subject.findMany({
      where,
      include: {
        course: { select: { id: true, name: true, code: true } }
      }
    });
    res.status(200).json({ success: true, data: subjects });
  } catch (error) {
    next(error);
  }
};
