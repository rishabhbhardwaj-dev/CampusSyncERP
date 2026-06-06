const prisma = require('../../config/db');

exports.getAll = async (req, res, next) => {
  try {
    const role = req.user.role;
    // Admins see all. Students/Faculty see notices with no targetRole or matching targetRole
    const where = role === 'ADMIN' ? {} : {
      OR: [
        { targetRole: null },
        { targetRole: role }
      ]
    };

    const notices = await prisma.notice.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        postedBy: { select: { name: true, role: true } }
      }
    });

    res.status(200).json({ success: true, data: notices });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { title, content, priority, targetRole } = req.body;
    
    const notice = await prisma.notice.create({
      data: {
        title,
        content,
        priority: priority || 'MEDIUM',
        targetRole: targetRole || null,
        postedById: req.user.id
      }
    });

    res.status(201).json({ success: true, data: notice });
  } catch (error) {
    next(error);
  }
};

exports.deleteNotice = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.notice.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
