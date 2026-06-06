const prisma = require('../../config/db');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const role = req.user.role;

    let stats = {};

    if (role === 'ADMIN') {
      const [totalStudents, totalFaculty, totalDepartments] = await Promise.all([
        prisma.student.count(),
        prisma.faculty.count(),
        prisma.department.count(),
      ]);
      
      stats = {
        totalStudents,
        totalFaculty,
        totalDepartments,
        revenue: '₹24.5L' // Placeholder for fees module
      };
    } else if (role === 'FACULTY') {
      const [mySubjects, totalStudents] = await Promise.all([
        prisma.subject.count(), // Simplification for now
        prisma.student.count(),
      ]);
      
      stats = {
        classesToday: 5,
        mySubjects,
        totalStudents,
        pendingAttendance: 2
      };
    } else if (role === 'STUDENT') {
      stats = {
        attendance: '87%',
        subjects: 6,
        upcomingExams: 3,
        feesDue: '₹15,000'
      };
    }

    // Recent activity (notices)
    const recentNotices = await prisma.notice.findMany({
      take: 4,
      orderBy: { createdAt: 'desc' },
      include: { postedBy: { select: { name: true } } }
    });

    res.status(200).json({ success: true, data: { stats, recentActivity: recentNotices } });
  } catch (error) {
    next(error);
  }
};
