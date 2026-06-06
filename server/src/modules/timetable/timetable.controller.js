const prisma = require('../../config/db');

exports.getTimetable = async (req, res, next) => {
  try {
    const { courseId, semester } = req.query;
    
    if (!courseId || !semester) {
      return res.status(400).json({ success: false, message: 'Missing course or semester filter' });
    }

    const timetable = await prisma.timetable.findMany({
      where: {
        courseId: parseInt(courseId),
        semester: parseInt(semester)
      },
      include: {
        subject: true,
        faculty: { include: { user: { select: { name: true } } } }
      },
      orderBy: { startTime: 'asc' }
    });

    // Group by dayOfWeek
    const grouped = {
      MONDAY: [], TUESDAY: [], WEDNESDAY: [], THURSDAY: [], FRIDAY: [], SATURDAY: []
    };

    timetable.forEach(t => {
      if (grouped[t.dayOfWeek]) {
        grouped[t.dayOfWeek].push({
          id: t.id,
          subject: t.subject.name,
          time: `${t.startTime} - ${t.endTime}`,
          room: t.room,
          faculty: t.faculty.user.name
        });
      }
    });

    res.status(200).json({ success: true, data: grouped });
  } catch (error) {
    next(error);
  }
};
