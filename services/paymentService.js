
const { Cart } = require('../models');
async function getCart(userId) {
  const cart = await Cart.findOne({
      where: { userId }
  });
  return cart;
}
class PaymentService {
    constructor(TransactionModel, CartModel, CartItemModel, ProductModel) {
        this.TransactionModel = TransactionModel;
        this.CartModel = CartModel;
        this.CartItemModel = CartItemModel;
        this.ProductModel = ProductModel;
    }
    // Processar pagamento com cartão de crédito
    async processCreditCardPayment(userId) {
        // 1. Obter o carrinho e os itens do carrinho para o usuário
        const cart = await getCart(userId); // Adiciona await aqui

        if (!cart || !cart.items.length) {
            throw new Error('Carrinho vazio ou não encontrado.');
        }

        // 2. Calcular o valor total
        let valorTotal = 0;
        cart.items.forEach(item => {
            valorTotal += item.quantity * item.product.preco;
        });

        // 3. Simular processamento de pagamento via cartão de crédito
        const status = Math.random() > 0.5 ? 'concluido' : 'falhado';  // Simulação

        if (status === 'falhado') {
            throw new Error('Falha no processamento do pagamento.');
        }

        // 4. Descontar os itens do estoque
        for (const item of cart.items) {
            const product = await this.ProductModel.findByPk(item.productId);
            if (product.estoque < item.quantity) {
                throw new Error(`Estoque insuficiente para o produto: ${product.nome}`);
            }

            // Atualizar o estoque
            product.estoque -= item.quantity;
            await product.save();
        }

        // 5. Registrar a transação
        const transaction = await this.TransactionModel.create({
            userId,
            valorTotal,
            metodoPagamento: 'cartao_de_credito',
            status
        });

        // 6. Excluir o carrinho e os itens do carrinho
        await this.CartItemModel.destroy({ where: { cartId: cart.cartId } });
        await this.CartModel.destroy({ where: { cartId: cart.cartId } });

        return transaction;
    }

    // Processar pagamento com PIX
    async processPixPayment(userId) {
        // A lógica será praticamente a mesma do cartão de crédito
        const cart = await getCart(userId); // Usa a função getCart

        if (!cart || !cart.items.length) {
            throw new Error('Carrinho vazio ou não encontrado.');
        }

        let valorTotal = 0;
        cart.items.forEach(item => {
            valorTotal += item.quantity * item.product.preco;
        });

        const status = 'concluido';  // Sucesso no PIX

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
