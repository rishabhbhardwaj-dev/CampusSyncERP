const express = require('express');
const authenticate = require('../../middleware/auth');
const authorize = require('../../middleware/rbac');
const attendanceController = require('./attendance.controller');

const router = express.Router();

router.use(authenticate); // All attendance routes require auth

router.get('/stats', attendanceController.getStudentStats);

router.route('/')
  .get(attendanceController.getByDate)
  .post(authorize('ADMIN', 'FACULTY'), attendanceController.create);

router.route('/:id')
  .put(authorize('ADMIN', 'FACULTY'), attendanceController.update)
  .delete(authorize('ADMIN', 'FACULTY'), attendanceController.delete);

module.exports = router;
