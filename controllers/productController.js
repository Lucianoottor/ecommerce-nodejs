class ProductController {
    constructor(ProductService) {
        this.productService = ProductService;
    }

    async createProduct(req, res) {
        try {
            const { nome, descricao, preco, estoque } = req.body;
            const newProduct = await this.productService.create(nome, descricao, preco, estoque);
            res.status(201).json(newProduct);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async findAllProducts(req, res) {
        try {
            const products = await this.productService.findAll();
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateProduct(req, res) {
        try {
            const { id } = req.params;
            const { nome, descricao, preco, estoque } = req.body;
            const product = await this.productService.update(id, { nome, descricao, preco, estoque });

            if (!product) {
                return res.status(404).json({ error: 'Produto não encontrado' });
            }

            res.json(product);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteProduct(req, res) {
        try {
            const { id } = req.params;
            const success = await this.productService.delete(id);

            if (!success) {
                return res.status(404).json({ error: 'Produto não encontrado' });
            }

            res.json({ message: 'Produto deletado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = ProductController;