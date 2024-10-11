const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Rota para pagamento via cartão de crédito
router.post('/credit-card', paymentController.processCreditCardPayment);

// Rota para pagamento via PIX
router.post('/pix', paymentController.processPixPayment);

module.exports = router;
