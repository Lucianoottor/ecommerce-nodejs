class PaymentController {
  constructor(PaymentService) {
    this.paymentService = PaymentService;
  }

  async processCreditCardPayment(req, res) {
    try {
      const transaction = await this.paymentService.processCreditCardPayment(req.user.id);
      res.json({ data: transaction });
    } catch (error) {
      res.status(400).json({ error: error.message, statusCode: 400 });
    }
  }

  async processPixPayment(req, res) {
    try {
      const transaction = await this.paymentService.processPixPayment(req.user.id);
      res.json({ data: transaction });
    } catch (error) {
      res.status(400).json({ error: error.message, statusCode: 400 });
    }
  }

  async getAllTransactions(req, res) {
    try {
      const transactions = await this.paymentService.getAllTransactions();
      res.json({ data: transactions });
    } catch (error) {
      res.status(500).json({ error: error.message, statusCode: 500 });
    }
  }
}

module.exports = PaymentController;
