const express = require('express');
const authenticate = require('../../middleware/auth');
const {
  getDepartments,
  getCourses,
  getSubjects
} = require('./academic.controller');

const router = express.Router();

router.use(authenticate); // All authenticated users can read academic structure

router.get('/departments', getDepartments);
router.get('/courses', getCourses);
router.get('/subjects', getSubjects);

module.exports = router;
