const prisma = require('../../config/db');

exports.getMarks = async (req, res, next) => {
  try {
    const { courseId, semester, subjectId, examType } = req.query;
    
    // Validate required fields
    if (!courseId || !semester || !subjectId || !examType) {
      return res.status(400).json({ success: false, message: 'Missing required filters' });
    }

    const marks = await prisma.mark.findMany({
      where: {
        subjectId: parseInt(subjectId),
        examType: examType,
        student: {
          courseId: parseInt(courseId),
          semester: parseInt(semester)
        }
      },
      include: {
        student: {
          select: { id: true, enrollmentNo: true, user: { select: { name: true } } }
        }
      }
    });

    res.status(200).json({ success: true, data: marks });
  } catch (error) {
    next(error);
  }
};

exports.saveMarks = async (req, res, next) => {
  try {
    const { subjectId, examType, marksData, maxMarks } = req.body;
    // marksData should be array: [{ studentId: 1, marksObtained: 85 }, ...]

    if (!subjectId || !examType || !marksData || !Array.isArray(marksData)) {
      return res.status(400).json({ success: false, message: 'Invalid data format' });
    }

    // Process each mark entry. Using transactions or simple loop.
    // Upsert is best: if mark exists, update. If not, create.
    const session = '2025-26'; // Hardcoded for prototype

    const results = await prisma.$transaction(
      marksData.map((data) => {
        return prisma.mark.upsert({
          where: {
            studentId_subjectId_examType_session: {
              studentId: data.studentId,
              subjectId: parseInt(subjectId),
              examType: examType,
              session: session
            }
          },
          update: {
            marksObtained: parseFloat(data.marksObtained),
            maxMarks: parseFloat(maxMarks) || 100
          },
          create: {
            studentId: data.studentId,
            subjectId: parseInt(subjectId),
            examType: examType,
            marksObtained: parseFloat(data.marksObtained),
            maxMarks: parseFloat(maxMarks) || 100,
            session: session
          }
        });
      })
    );

    res.status(200).json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

exports.getMyMarks = async (req, res, next) => {
  try {
    const student = await prisma.student.findUnique({ where: { userId: req.user.id } });
    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });

    const { semester } = req.query;
    const whereClause = { studentId: student.id };
    if (semester) {
      whereClause.subject = { semester: parseInt(semester) };
    }

    const marks = await prisma.mark.findMany({
      where: whereClause,
      include: { subject: true },
      orderBy: [{ subject: { semester: 'desc' } }, { subjectId: 'asc' }]
    });

    res.status(200).json({ success: true, data: marks });
  } catch (error) {
    next(error);
  }
};
