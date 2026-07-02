const { uploadFile, deleteFile } = require('../services/s3Service');

class ProductController {
    constructor(ProductService) {
        this.productService = ProductService;
    }

    async createProduct(req, res) {
        try {
            const { name, description, price, stock } = req.body;

            if (!name || price === undefined || stock === undefined) {
                return res.status(400).json({ error: 'Name, price, and stock are required', statusCode: 400 });
            }

            let imageUrl = null;
            if (req.file) {
                imageUrl = await uploadFile(req.file);
            }

            const newProduct = await this.productService.create(name, description, price, stock, imageUrl);
            res.status(201).json({ data: newProduct });
        } catch (error) {
            res.status(500).json({ error: error.message, statusCode: 500 });
        }
    }

    async findAllProducts(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;

            const result = await this.productService.findAll({ page, limit });
            res.json({ data: result.products, pagination: result.pagination });
        } catch (error) {
            res.status(500).json({ error: error.message, statusCode: 500 });
        }
    }

    async findProductById(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'Invalid ID', statusCode: 400 });
            }
            const product = await this.productService.findById(id);
            if (!product) {
                return res.status(404).json({ error: 'Product not found', statusCode: 404 });
            }
            res.json({ data: product });
        } catch (error) {
            res.status(500).json({ error: error.message, statusCode: 500 });
        }
    }

    async updateProduct(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'Invalid ID', statusCode: 400 });
            }
            const { name, description, price, stock } = req.body;
            const updateData = { name, description, price, stock };

            if (req.file) {
                const existing = await this.productService.findById(id);
                if (existing && existing.imageUrl) {
                    await deleteFile(existing.imageUrl).catch(() => {});
                }
                updateData.imageUrl = await uploadFile(req.file);
            }

            const product = await this.productService.update(id, updateData);

            if (!product) {
                return res.status(404).json({ error: 'Product not found', statusCode: 404 });
            }

            res.json({ data: product });
        } catch (error) {
            res.status(500).json({ error: error.message, statusCode: 500 });
        }
    }

    async deleteProduct(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'Invalid ID', statusCode: 400 });
            }

            const product = await this.productService.findById(id);
            if (!product) {
                return res.status(404).json({ error: 'Product not found', statusCode: 404 });
            }

            if (product.imageUrl) {
                await deleteFile(product.imageUrl).catch(() => {});
            }

            await this.productService.delete(id);
            res.json({ data: { message: 'Product deleted successfully' } });
        } catch (error) {
            res.status(500).json({ error: error.message, statusCode: 500 });
        }
    }
}

module.exports = ProductController;
