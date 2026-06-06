const prisma = require('../../config/db');

exports.getDocuments = async (req, res, next) => {
  try {
    const { courseId, semester, subjectId } = req.query;
    const where = {};
    
    if (courseId) where.courseId = parseInt(courseId);
    if (semester) where.semester = parseInt(semester);
    if (subjectId) where.subjectId = parseInt(subjectId);

    const documents = await prisma.document.findMany({
      where,
      include: {
        uploader: { select: { name: true, role: true } },
        course: { select: { name: true } },
        subject: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ success: true, data: documents });
  } catch (error) {
    next(error);
  }
};

exports.uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { title, courseId, semester, subjectId } = req.body;
    
    if (!title) {
      return res.status(400).json({ success: false, message: 'Document title is required' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    const document = await prisma.document.create({
      data: {
        title,
        filename: req.file.originalname,
        fileUrl,
        fileType: req.file.mimetype,
        size: req.file.size,
        uploadedById: req.user.id,
        courseId: courseId ? parseInt(courseId) : null,
        semester: semester ? parseInt(semester) : null,
        subjectId: subjectId ? parseInt(subjectId) : null
      },
      include: {
        uploader: { select: { name: true, role: true } }
      }
    });

    res.status(201).json({ success: true, data: document });
  } catch (error) {
    next(error);
  }
};

exports.deleteDocument = async (req, res, next) => {
  try {
    const documentId = parseInt(req.params.id);
    const document = await prisma.document.findUnique({ where: { id: documentId } });
    
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    // Optional: Only allow the uploader or admin to delete
    if (document.uploadedById !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this document' });
    }

    await prisma.document.delete({ where: { id: documentId } });

    res.status(200).json({ success: true, message: 'Document deleted successfully' });
  } catch (error) {
    next(error);
  }
};
