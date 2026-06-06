const express = require('express');
const authenticate = require('../../middleware/auth');
const authorize = require('../../middleware/rbac');
const feesController = require('./fees.controller');

const router = express.Router();

router.use(authenticate);

router.get('/my-fees', feesController.getMyFees);
router.get('/', authorize('ADMIN'), feesController.getFees);
router.post('/', authorize('ADMIN'), feesController.createFee);
router.post('/:id/pay', authorize('ADMIN', 'STUDENT'), feesController.payFee);

module.exports = router;
