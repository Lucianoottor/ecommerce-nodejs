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
          throw new Error('Product not found');
        }

        if (product.stock < quantity) {
          throw new Error(`Requested quantity (${quantity}) exceeds available stock (${product.stock}).`);
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
          if (product.stock < newQuantity) {
            throw new Error(`Total quantity in cart (${newQuantity}) exceeds available stock (${product.stock}).`);
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
          throw new Error('Cart not found for this user');
      }

      return cart.items;
    }

    async removeItem(userId, productId) {
      try {
        let cart = await this.CartModel.findOne({
            where: { userId }
        });
        if (!cart) {
          throw new Error("Cart doesn't exist");
        }
        let cartItem = await this.CartItemModel.findOne({where: {cartId: cart.cartId, productId: productId}});

        if (!cartItem) {
          throw new Error('Item not found in cart');
        }

        await cartItem.destroy();

        return { message: 'Item removed from cart successfully' };
      } catch (error) {
        throw new Error(error.message);
      }
    }
}

module.exports = CartService;
