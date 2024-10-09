// services/cartService.js
class CartService {
    constructor(CartModel, CartItemModel, ProductModel) {
      this.CartModel = CartModel;
      this.CartItemModel = CartItemModel;
      this.ProductModel = ProductModel;
    }
  
    // Method to add a product to a user's cart
    async addItemToCart(userId, productId, quantity = 1) {
      try {
        // Find the product to ensure it exists
        const product = await this.ProductModel.findByPk(productId);
        if (!product) {
          throw new Error('Product not found');
        }
  
        // Find or create a cart for the user
        let cart = await this.CartModel.findOne({ where: { userId } });
        if (!cart) {
          cart = await this.CartModel.create({ userId });
        }
  
        // Check if the item is already in the cart
        let cartItem = await this.CartItemModel.findOne({
          where: { cartId: cart.cartId, productId },
        });
  
        if (cartItem) {
          // Update the quantity if the item already exists
          cartItem.quantity += quantity;
          await cartItem.save();
        } else {
          // Add the item if it doesn't exist
          cartItem = await this.CartItemModel.create({
            cartId: cart.cartId,
            productId,
            quantity,
          });
        }
  
        return cartItem;
      } catch (error) {
        throw new Error(error.message);
      }
    }
    
    async getCartItems(userId) {
      // Verifica se o usuário tem um carrinho associado
      // Find or create a cart for the user
      let cart = await this.CartModel.findOne({ where: { userId } });
      // Se o carrinho não for encontrado
      if (!cart) {
          throw new Error('Cesta não encontrada para este usuário.');
      }
      // Retorna os itens do carrinho
      return cart.items.map(item => ({
          productId: item.productId,
          nome: item.product.nome,
          quantity: item.quantity,
      }));
  }
  async removeItemFromCart(userId, productId) {
    // Verificar se o carrinho do usuário existe
    const cart = await this.cartModel.findOne({
        where: { userId }
    });

    if (!cart) {
        throw new Error('Cesta não encontrada para este usuário.');
    }

    // Verificar se o item está no carrinho
    const cartItem = await this.cartItemModel.findOne({
        where: { cartId: cart.cartId, productId }
    });

    if (!cartItem) {
        throw new Error('Produto não encontrado na cesta.');
    }

    // Remover o item do carrinho
    await cartItem.destroy();

    return { message: 'Produto removido da cesta com sucesso.' };
}
    
  }
  
  module.exports = CartService;
  