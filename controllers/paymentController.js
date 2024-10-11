const PaymentService = require('../services/paymentService');
const paymentService = new PaymentService(
  require('../models/transaction'),
  require('../models/cart'),
  require('../models/cartItem'),
  require('../models/products')
);

module.exports = {
  async processCreditCardPayment(req, res) {
    const { userId } = req.body; // userId enviado no corpo da requisição

    try {
      const transaction = await paymentService.processCreditCardPayment(userId);
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async processPixPayment(req, res) {
    const { userId } = req.body;

    try {
      const transaction = await paymentService.processPixPayment(userId);
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};
