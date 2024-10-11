// routes/cart.js
const express = require('express');
const router = express.Router();
const auth = require('../auth'); // Import authentication middleware

// Import services and controller
const db = require('../models'); // Load database models
const CartService = require('../services/cartService'); // Load CartService
const CartController = require('../controllers/cartController'); // Load CartController

// Initialize service and controller
const cartService = new CartService(db.Cart, db.CartItem, db.Product);
const cartController = new CartController(cartService);


// Route to add an item to the cart (protected route)
router.post('/addItem', auth.verifyToken, (req, res) => {
  cartController.addItemToCart(req, res);
});

router.get('/getItems', auth.verifyToken, (req, res) => {
  cartController.getCartItems(req, res);
});

router.delete('/remove/:productId', auth.verifyToken, async (req, res) => {
  cartController.removeItem(req, res);
});

module.exports = router;
