const express = require('express');
const router = express.Router();
const documentController = require('./document.controller');
const authenticate = require('../../middleware/auth');
const authorize = require('../../middleware/rbac');
const upload = require('../../middleware/upload');

router.use(authenticate);

// Get documents based on filters (course, semester, subject)
router.get('/', documentController.getDocuments);

// Upload a new document
router.post('/upload', authorize('ADMIN', 'FACULTY', 'STUDENT'), upload.single('file'), documentController.uploadDocument);

// Delete a document
router.delete('/:id', authorize('ADMIN', 'FACULTY'), documentController.deleteDocument);

module.exports = router;
