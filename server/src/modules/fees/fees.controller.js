const prisma = require('../../config/db');

exports.getMyFees = async (req, res, next) => {
  try {
    const student = await prisma.student.findUnique({ where: { userId: req.user.id } });
    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });

    const { semester } = req.query;
    const whereClause = { studentId: student.id };
    
    // Fee doesn't have semester directly, but we can assume session/date or just return all fees.
    // For this implementation, let's assume we return all and they can view history.
    // We can filter by status if needed.
    
    const fees = await prisma.fee.findMany({
      where: whereClause,
      orderBy: { dueDate: 'desc' }
    });

    res.status(200).json({ success: true, data: fees });
  } catch (error) {
    next(error);
  }
};

exports.getFees = async (req, res, next) => {
  try {
    const { courseId, semester } = req.query;
    
    if (!courseId || !semester) {
      return res.status(400).json({ success: false, message: 'Missing course or semester filter' });
    }

    // Get all students in this course/sem, then get their fees
    const students = await prisma.student.findMany({
      where: { courseId: parseInt(courseId), semester: parseInt(semester) },
      include: {
        user: { select: { name: true } },
        fees: { orderBy: { dueDate: 'desc' } }
      }
    });

    res.status(200).json({ success: true, data: students });
  } catch (error) {
    next(error);
  }
};

exports.createFee = async (req, res, next) => {
  try {
    const { studentId, feeType, amount, dueDate, session, remarks } = req.body;
    
    const fee = await prisma.fee.create({
      data: {
        studentId: parseInt(studentId),
        feeType,
        amount: parseFloat(amount),
        dueDate: new Date(dueDate),
        session: session || '2025-26',
        remarks
      }
    });
    
    res.status(201).json({ success: true, data: fee });
  } catch (error) {
    next(error);
  }
};

exports.payFee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    
    const fee = await prisma.fee.findUnique({ where: { id: parseInt(id) } });
    if (!fee) return res.status(404).json({ success: false, message: 'Fee not found' });
    
    const newPaid = fee.paidAmount + parseFloat(amount);
    let status = 'PARTIAL';
    if (newPaid >= fee.amount) status = 'PAID';
    
    const updated = await prisma.fee.update({
      where: { id: fee.id },
      data: {
        paidAmount: newPaid,
        status,
        paidDate: new Date()
      }
    });
    
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};
