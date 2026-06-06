const express = require('express');
const authenticate = require('../../middleware/auth');
const authorize = require('../../middleware/rbac');
const noticeController = require('./notice.controller');

const router = express.Router();

router.use(authenticate);

router.get('/', noticeController.getAll);
router.post('/', authorize('ADMIN', 'FACULTY'), noticeController.create);
router.delete('/:id', authorize('ADMIN', 'FACULTY'), noticeController.deleteNotice);

module.exports = router;
