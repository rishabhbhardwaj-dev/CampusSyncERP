const express = require('express');
const authenticate = require('../../middleware/auth');
const timetableController = require('./timetable.controller');

const router = express.Router();

router.use(authenticate);

router.get('/', timetableController.getTimetable);

module.exports = router;
