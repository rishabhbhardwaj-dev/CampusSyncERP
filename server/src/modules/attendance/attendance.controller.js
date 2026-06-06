// ─── Attendance Controller ─────────────────────────────────────
// Handles CRUD for attendance records.
// All routes require authentication. Admin & Faculty can create/update/delete.
// GET /api/attendance?date=YYYY-MM-DD&subjectId=1 – list attendance for the day.
// POST /api/attendance – create a record.
// PUT /api/attendance/:id – update status.
// DELETE /api/attendance/:id – delete a record.

const prisma = require('../../config/db');
const ApiError = require('../../utils/apiError');

// Helper to parse date string to start/end of day
const getDayRange = (dateStr) => {
  const date = new Date(dateStr);
  const start = new Date(date.setHours(0,0,0,0));
  const end = new Date(date.setHours(23,59,59,999));
  return { start, end };
};

// GET attendance for a specific date (optional subject filter)
const getByDate = async (req, res, next) => {
  try {
    const { date, subjectId } = req.query;
    if (!date) throw new ApiError(400, 'Date query parameter is required');
    const { start, end } = getDayRange(date);
    const where = { date: { gte: start, lte: end } };
    if (subjectId) where.subjectId = parseInt(subjectId);

    const records = await prisma.attendance.findMany({
      where,
      include: { student: { select: { id: true, enrollmentNo: true, user: { select: { name: true } } } }, subject: true, faculty: true },
      orderBy: { studentId: 'asc' },
    });

    const formatted = records.map(r => ({
      id: r.id,
      studentId: r.studentId,
      studentName: r.student.user.name,
      enrollmentNo: r.student.enrollmentNo,
      subjectId: r.subjectId,
      subjectName: r.subject?.name,
      status: r.status,
      date: r.date,
    }));

    res.json({ success: true, data: formatted });
  } catch (err) { next(err); }
};

const getStudentStats = async (req, res, next) => {
  try {
    const student = await prisma.student.findUnique({ where: { userId: req.user.id } });
    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });

    const { semester } = req.query;
    const whereClause = { studentId: student.id };
    if (semester) {
      whereClause.subject = { semester: parseInt(semester) };
    }

    const records = await prisma.attendance.findMany({
      where: whereClause,
      include: { subject: true }
    });

    const statsMap = {};
    records.forEach(r => {
      if (!statsMap[r.subjectId]) {
        statsMap[r.subjectId] = { subjectName: r.subject.name, subjectCode: r.subject.code, attended: 0, total: 0 };
      }
      statsMap[r.subjectId].total += 1;
      if (r.status === 'PRESENT' || r.status === 'LATE') {
        statsMap[r.subjectId].attended += 1;
      }
    });

    const stats = Object.values(statsMap).map(s => ({
      ...s,
      percentage: Math.round((s.attended / s.total) * 100)
    }));

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

// CREATE attendance record
const create = async (req, res, next) => {
  try {
    const { studentId, subjectId, status, date } = req.body;
    if (!studentId || !subjectId || !status || !date) {
      throw new ApiError(400, 'studentId, subjectId, status, and date are required');
    }
    const record = await prisma.attendance.create({
      data: {
        studentId: parseInt(studentId),
        subjectId: parseInt(subjectId),
        facultyId: req.user.id,
        status,
        date: new Date(date),
        session: `${new Date().getFullYear()}-${new Date().getFullYear()+1}`,
      },
    });
    res.status(201).json({ success: true, data: record });
  } catch (err) { next(err); }
};

// UPDATE attendance status
const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) throw new ApiError(400, 'Status is required');
    const updated = await prisma.attendance.update({
      where: { id: parseInt(id) },
      data: { status },
    });
    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
};

// DELETE attendance record
const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.attendance.delete({ where: { id: parseInt(id) } });
    res.json({ success: true, message: 'Attendance record deleted' });
  } catch (err) { next(err); }
};

module.exports = { getByDate, getStudentStats, create, update, delete: remove };
