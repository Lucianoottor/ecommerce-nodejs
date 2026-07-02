class PaymentService {
    constructor(TransactionModel, CartModel, CartItemModel, ProductModel) {
        this.TransactionModel = TransactionModel;
        this.CartModel = CartModel;
        this.CartItemModel = CartItemModel;
        this.ProductModel = ProductModel;
    }

    async getCart(userId) {
        const cart = await this.CartModel.findOne({
            where: { userId },
            include: [{
              model: this.CartItemModel,
              as: 'items',
              include: [{
                  model: this.ProductModel,
                  as: 'product'
              }]
          }]
        });
        return cart;
    }

    async processCreditCardPayment(userId) {
        const cart = await this.getCart(userId);
        if (!cart || !cart.items.length) {
            throw new Error('Cart is empty or not found');
        }

        let totalAmount = 0;
        cart.items.forEach(item => {
            totalAmount += item.quantity * item.product.price;
        });

        const status = Math.random() > 0.5 ? 'completed' : 'failed';

        if (status === 'failed') {
            await this.TransactionModel.create({
                userId, totalAmount, paymentMethod: 'credit_card', status
            });
            throw new Error('Payment processing failed');
        }

        const { sequelize } = this.CartModel;
        return await sequelize.transaction(async (t) => {
            for (const item of cart.items) {
                const product = item.product;
                if (product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for product: ${product.name}`);
                }
                product.stock -= item.quantity;
                await product.save({ transaction: t });
            }

            const transaction = await this.TransactionModel.create({
                userId, totalAmount, paymentMethod: 'credit_card', status
            }, { transaction: t });

            await this.CartItemModel.destroy({ where: { cartId: cart.cartId }, transaction: t });
            await this.CartModel.destroy({ where: { cartId: cart.cartId }, transaction: t });

            return transaction;
        });
    }

    async processPixPayment(userId) {
        const cart = await this.getCart(userId);
        if (!cart || !cart.items.length) {
            throw new Error('Cart is empty or not found');
        }

        const { sequelize } = this.CartModel;
        return await sequelize.transaction(async (t) => {
            let totalAmount = 0;
            cart.items.forEach(item => {
                totalAmount += item.quantity * item.product.price;
            });

            for (const item of cart.items) {
                const product = item.product;
                if (product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for product: ${product.name}`);
                }
                product.stock -= item.quantity;
                await product.save({ transaction: t });
            }

            const transaction = await this.TransactionModel.create({
                userId, totalAmount, paymentMethod: 'pix', status: 'completed'
            }, { transaction: t });

            await this.CartItemModel.destroy({ where: { cartId: cart.cartId }, transaction: t });
            await this.CartModel.destroy({ where: { cartId: cart.cartId }, transaction: t });

            return transaction;
        });
    }
    async getAllTransactions() {
        return await this.TransactionModel.findAll({
            order: [['createdAt', 'DESC']]
        });
    }
}

module.exports = PaymentService;
