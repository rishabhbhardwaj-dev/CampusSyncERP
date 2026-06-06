const express = require('express');
const authenticate = require('../../middleware/auth');
const usersController = require('./users.controller');

const router = express.Router();

router.use(authenticate);

router.put('/profile', usersController.updateProfile);
router.put('/change-password', usersController.changePassword);

module.exports = router;
