// routes/products.js
const express = require('express');
const router = express.Router();
const db = require('../models');

// Rota para criação de um novo produto (POST /products)
router.post('/', async (req, res) => {
  try {
    const { nome, descricao, preco, estoque } = req.body;
    const newProduct = await db.Product.create({ nome, descricao, preco, estoque });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para listar todos os produtos (GET /products)
router.get('/', async (req, res) => {
  try {
    const products = await db.Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para atualizar um produto existente (PUT /products/:id)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, preco, estoque } = req.body;
    const product = await db.Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    await product.update({ nome, descricao, preco, estoque });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para deletar um produto (DELETE /products/:id)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await db.Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    await product.destroy();
    res.json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
