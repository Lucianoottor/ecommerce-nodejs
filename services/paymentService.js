
const { Cart } = require('../models');

class PaymentService {
    constructor(TransactionModel, CartModel, CartItemModel, ProductModel) {
        this.TransactionModel = TransactionModel;
        this.CartModel = CartModel;
        this.CartItemModel = CartItemModel;
        this.ProductModel = ProductModel;
    }

    async getCart(userId) {
        const cart = await Cart.findOne({
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
            throw new Error('Carrinho vazio ou não encontrado.');
        }
        let valorTotal = 0;
        cart.items.forEach(item => {
            valorTotal += item.quantity * item.product.preco;
        });

      
        const status = Math.random() > 0.5 ? 'concluido' : 'falhado';

        if (status === 'falhado') {
            throw new Error('Falha no processamento do pagamento.');
        }

        for (const item of cart.items) {
            const product = await this.ProductModel.findByPk(item.productId);
            if (product.estoque < item.quantity) {
                throw new Error(`Estoque insuficiente para o produto: ${product.nome}`);
            }

            product.estoque -= item.quantity;
            await product.save();
        }

        const transaction = await this.TransactionModel.create({
            userId,
            valorTotal,
            metodoPagamento: 'cartao_de_credito',
            status
        });

        await this.CartItemModel.destroy({ where: { cartId: cart.cartId } });
        await this.CartModel.destroy({ where: { cartId: cart.cartId } });

        return transaction;
    }

    async processPixPayment(userId) {

        const cart = await this.getCart(userId); 

        if (!cart || !cart.items.length) {
            throw new Error('Carrinho vazio ou não encontrado.');
        }

        let valorTotal = 0;
        cart.items.forEach(item => {
            valorTotal += item.quantity * item.product.preco;
        });

        const status = 'concluido'; 

        for (const item of cart.items) {
            const product = await this.ProductModel.findByPk(item.productId);
            if (product.estoque < item.quantity) {
                throw new Error(`Estoque insuficiente para o produto: ${product.nome}`);
            }

            product.estoque -= item.quantity;
            await product.save();
        }

        const transaction = await this.TransactionModel.create({
            userId,
            valorTotal,
            metodoPagamento: 'pix',
            status
        });

        await this.CartItemModel.destroy({ where: { cartId: cart.cartId } });
        await this.CartModel.destroy({ where: { cartId: cart.cartId } });

        return transaction;
    }
}

module.exports = PaymentService;
