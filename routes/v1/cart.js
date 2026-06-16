const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const db = require('../../models'); 
const CartService = require('../../services/cartService'); 
const CartController = require('../../controllers/cartController'); 

const cartService = new CartService(db.Cart, db.CartItem, db.Product);
const cartController = new CartController(cartService);


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
