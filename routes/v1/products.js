const express = require('express');
const router = express.Router();
const db = require('../models');
const ProductService = require('../services/productService');
const ProductController = require('../controllers/productController');

const productService = new ProductService(db.Product);
const productController = new ProductController(productService);

router.post('/', async (req, res) => {
    productController.createProduct(req, res);
});

router.get('/', async (req, res) => {
    productController.findAllProducts(req, res);
});

router.put('/:id', async (req, res) => {
    productController.updateProduct(req, res);
});

router.delete('/:id', async (req, res) => {
    productController.deleteProduct(req, res);
});

module.exports = router;