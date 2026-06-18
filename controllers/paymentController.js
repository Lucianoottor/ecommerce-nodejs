class PaymentController {
  constructor(PaymentService) {
    this.paymentService = PaymentService;
  }

  async processCreditCardPayment(req, res) {
    try {
      const transaction = await this.paymentService.processCreditCardPayment(req.user.id);
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async processPixPayment(req, res) {
    try {
      const transaction = await this.paymentService.processPixPayment(req.user.id);
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = PaymentController;
