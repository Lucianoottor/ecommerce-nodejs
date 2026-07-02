const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const rbacMiddleware = require('../../middleware/rbac');
const upload = require('../../middleware/upload');
const db = require('../../models');
const ProductService = require('../../services/productService');
const ProductController = require('../../controllers/productController');

const productService = new ProductService(db.Product);
const productController = new ProductController(productService);

router.post('/', auth.verifyToken, rbacMiddleware.checkPermission('create_product'), upload.single('image'), async (req, res) => {
    productController.createProduct(req, res);
});

router.get('/', async (req, res) => {
    productController.findAllProducts(req, res);
});

router.get('/:id', async (req, res) => {
    productController.findProductById(req, res);
});

router.put('/:id', auth.verifyToken, rbacMiddleware.checkPermission('update_product'), upload.single('image'), async (req, res) => {
    productController.updateProduct(req, res);
});

router.delete('/:id', auth.verifyToken, rbacMiddleware.checkPermission('delete_product'), async (req, res) => {
    productController.deleteProduct(req, res);
});

module.exports = router;
