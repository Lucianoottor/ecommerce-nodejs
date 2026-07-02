class CartController {
    constructor(cartService) {
      this.cartService = cartService;
    }

    async addItemToCart(req, res) {
      const { productId, quantity } = req.body;
      const userId = req.user.id;

      if (!productId) {
          return res.status(400).json({ error: 'Product ID is required', statusCode: 400 });
      }

      if (quantity !== undefined && (!Number.isInteger(quantity) || quantity <= 0)) {
          return res.status(400).json({ error: 'Quantity must be a positive integer', statusCode: 400 });
      }

      try {
        const cartItem = await this.cartService.addItemToCart(userId, productId, quantity);
        return res.status(200).json({ data: cartItem });
      } catch (error) {
        return res.status(500).json({ error: error.message, statusCode: 500 });
      }
    }

    async getCartItems(req, res) {
      const userId = req.user.id;
      try {
        const cartItems = await this.cartService.getCartItems(userId);
        return res.status(200).json({ data: cartItems });
      } catch (error) {
        return res.status(500).json({ error: error.message, statusCode: 500 });
      }
    }

    async removeItem(req, res) {
      const { productId } = req.params;
      const userId = req.user.id;
      try {
        await this.cartService.removeItem(userId, productId);
        return res.status(200).json({ data: { message: 'Item removed from cart' } });
      } catch (error) {
        return res.status(500).json({ error: error.message, statusCode: 500 });
      }
    }
}

module.exports = CartController;
