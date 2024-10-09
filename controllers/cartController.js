// controllers/cartController.js
class CartController {
    constructor(cartService) {
      this.cartService = cartService;
    }
  
    // Method to add an item to the cart
    async addItemToCart(req, res) {
      const { productId, quantity } = req.body;
      const userId = req.user.id;
      if (!userId) {
          return res.status(400).json({ message: 'User ID not found in token' });
      }
      try {
        const cartItem = await this.cartService.addItemToCart(userId, productId, quantity);
        return res.status(200).json({
          message: 'Item added to cart',
          cartItem,
        });
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    }

    // Method to get the cart items
    async getCartItems(req, res) {
      const userId = req.user.id;
      if (!userId) {
        return res.status(400).json({ message: 'User ID not found in token' });
      }
      try {
        const cartItems = await this.cartService.getCartItems(userId);
        return res.status(200).json(cartItems);
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    }

    // Method to remove an item from the cart
    async removeItemFromCart(req, res) {
      const { cartItemId } = req.body;
      const userId = req.user.id;
      if (!userId) {
        return res.status(400).json({ message: 'User ID not found in token' });
      }
      try {
        await this.cartService.removeItemFromCart(userId, cartItemId);
        return res.status(200).json({ message: 'Item removed from cart' });
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    }
  }
  
  module.exports = CartController;
  