const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const rbacMiddleware = require('../../middleware/rbac');
const db = require('../../models');
const ProductService = require('../../services/productService');
const ProductController = require('../../controllers/productController');

const productService = new ProductService(db.Product);
const productController = new ProductController(productService);

router.post('/', auth.verifyToken, rbacMiddleware.checkPermission('create_product'), async (req, res) => {
    productController.createProduct(req, res);
});

router.get('/', auth.verifyToken, rbacMiddleware.checkPermission('read_product'), async (req, res) => {
    productController.findAllProducts(req, res);
});

router.put('/:id', auth.verifyToken, rbacMiddleware.checkPermission('update_product'), async (req, res) => {
    productController.updateProduct(req, res);
});

router.delete('/:id', auth.verifyToken, rbacMiddleware.checkPermission('delete_product'), async (req, res) => {
    productController.deleteProduct(req, res);
});

module.exports = router;
