const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const rbacMiddleware = require('../../middleware/rbac');

const db = require('../../models'); 
const CartService = require('../../services/cartService'); 
const CartController = require('../../controllers/cartController'); 

const cartService = new CartService(db.Cart, db.CartItem, db.Product);
const cartController = new CartController(cartService);


router.post('/addItem', auth.verifyToken, rbacMiddleware.checkPermission('create_cart'), (req, res) => {
  cartController.addItemToCart(req, res);
}); 

router.get('/getItems', auth.verifyToken, rbacMiddleware.checkPermission('read_cart'), (req, res) => {
  cartController.getCartItems(req, res);
});

router.delete('/remove/:productId', auth.verifyToken, rbacMiddleware.checkPermission('delete_cart'), (req, res) => {
  cartController.removeItem(req, res);
});

module.exports = router;
