// services/cartService.js
class CartService {
    constructor(CartModel, CartItemModel, ProductModel) {
      this.CartModel = CartModel;
      this.CartItemModel = CartItemModel;
      this.ProductModel = ProductModel;
    }

    async addItemToCart(userId, productId, quantity = 1) {
      try {
        const product = await this.ProductModel.findByPk(productId);
        if (!product) {
          throw new Error('Produto não encontrado');
        }

        if (product.estoque < quantity) {
          throw new Error(`Quantidade solicitada (${quantity}) excede o estoque disponível (${product.estoque}).`);
        }

        let cart = await this.CartModel.findOne({ where: { userId } });
        if (!cart) {
          cart = await this.CartModel.create({ userId });
        }

        let cartItem = await this.CartItemModel.findOne({
          where: { cartId: cart.cartId, productId },
        });
    
        if (cartItem) {
          const newQuantity = cartItem.quantity + quantity;
          if (product.estoque < newQuantity) {
            throw new Error(`Quantidade total no carrinho (${newQuantity}) excede o estoque disponível (${product.estoque}).`);
          }
    
          cartItem.quantity = newQuantity;
          await cartItem.save();
        } else {
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
    
      let cart = await this.CartModel.findOne({
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
      
      if (!cart) {
          throw new Error('Cesta não encontrada para este usuário.');
      }
      
      return cart.items;
  }

  
  async removeItem(userId, productId) {
    try { 
      let cart = await this.CartModel.findOne({
          where: { userId }
      });
      if (!cart) { 
        throw new Error("Cart doesn't exist") 
      }
      let cartItem = await this.CartItemModel.findOne({where: {cartId: cart.cartId, productId: productId}});
      
      if (!cartItem) {
        throw new Error('Item não encontrado no carrinho.');
      }
  
      await cartItem.destroy();
      
      return { message: 'Item removido da cesta com sucesso.' };
    } catch (error) {
      throw new Error(error.message);
    }
  }
  
  
  }
  
  module.exports = CartService;
  