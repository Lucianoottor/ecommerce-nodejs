const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const db = require('../../models');
const PaymentService = require('../../services/paymentService');
const PaymentController = require('../../controllers/paymentController');

const paymentService = new PaymentService(db.Transaction, db.Cart, db.CartItem, db.Product);
const paymentController = new PaymentController(paymentService);

router.post('/credit-card', auth.verifyToken, (req, res) => paymentController.processCreditCardPayment(req, res));
router.post('/pix', auth.verifyToken, (req, res) => paymentController.processPixPayment(req, res));

module.exports = router;
