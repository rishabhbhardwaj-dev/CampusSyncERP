const express = require('express');
const authenticate = require('../../middleware/auth');
const authorize = require('../../middleware/rbac');
const {
  getAllFaculty,
  createFaculty,
  deleteFaculty
} = require('./faculty.controller');

const router = express.Router();

// All routes require authentication and ADMIN role
router.use(authenticate);
router.use(authorize('ADMIN'));

router.route('/')
  .get(getAllFaculty)
  .post(createFaculty);

router.route('/:id')
  .delete(deleteFaculty);

module.exports = router;
