const express = require('express');
const authenticate = require('../../middleware/auth');
const authorize = require('../../middleware/rbac');
const marksController = require('./marks.controller');

const router = express.Router();

router.use(authenticate);

router.get('/my-marks', marksController.getMyMarks);
router.get('/', marksController.getMarks);
router.post('/', authorize('ADMIN', 'FACULTY'), marksController.saveMarks);

module.exports = router;
