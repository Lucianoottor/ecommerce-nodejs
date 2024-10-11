// services/cartService.js
class CartService {
    constructor(CartModel, CartItemModel, ProductModel) {
      this.CartModel = CartModel;
      this.CartItemModel = CartItemModel;
      this.ProductModel = ProductModel;
    }
  
    // Method to add a product to a user's cart
    /*async addItemToCart(userId, productId, quantity = 1) {
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
    }*/
      async addItemToCart(userId, productId, quantity = 1) {
        try {
          // Encontra o produto para garantir que ele existe
          const product = await this.ProductModel.findByPk(productId);
          if (!product) {
            throw new Error('Produto não encontrado');
          }
      
          // Verifica se a quantidade desejada está disponível em estoque
          if (product.estoque < quantity) {
            throw new Error(`Quantidade solicitada (${quantity}) excede o estoque disponível (${product.estoque}).`);
          }
      
          // Encontra ou cria um carrinho para o usuário
          let cart = await this.CartModel.findOne({ where: { userId } });
          if (!cart) {
            cart = await this.CartModel.create({ userId });
          }
      
          // Verifica se o item já está no carrinho
          let cartItem = await this.CartItemModel.findOne({
            where: { cartId: cart.cartId, productId },
          });
      
          if (cartItem) {
            // Atualiza a quantidade se o item já existir
            const newQuantity = cartItem.quantity + quantity;
            
            // Verifica novamente se a nova quantidade não excede o estoque
            if (product.estoque < newQuantity) {
              throw new Error(`Quantidade total no carrinho (${newQuantity}) excede o estoque disponível (${product.estoque}).`);
            }
      
            cartItem.quantity = newQuantity;
            await cartItem.save();
          } else {
            // Adiciona o item se ele não existir
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
      // Fetch the cart for the user along with the associated items
      let cart = await this.CartModel.findOne({
          where: { userId }, 
          include: [{
              model: this.CartItemModel, // Include associated CartItems
              as: 'items',              // Use the alias defined in the association
              include: [{
                  model: this.ProductModel,  // Include associated products for each CartItem
                  as: 'product'
              }]
          }]
      });
      
      if (!cart) {
          throw new Error('Cesta não encontrada para este usuário.');
      }
      
      return cart.items;
  }

  
  async removeItem(cartItemId) {
    try {
      // Encontrar o item no carrinho pelo cartItemId
      let cartItem = await this.CartItemModel.findByPk(cartItemId);
      
      if (!cartItem) {
        throw new Error('Item não encontrado no carrinho.');
      }
  
      // Remove o item da cesta
      await cartItem.destroy();
      
      return { message: 'Item removido da cesta com sucesso.' };
    } catch (error) {
      throw new Error(error.message);
    }
  }
  
  
  }
  
  module.exports = CartService;
  