class ProductService {
    constructor(ProductModel) {
        this.Product = ProductModel;
    }

    async create(nome, descricao, preco, estoque) {
        try {
            return await this.Product.create({ nome, descricao, preco, estoque });
        } catch (error) {
            throw error;
        }
    }

    async findAll() {
        try {
            return await this.Product.findAll();
        } catch (error) {
            throw error;
        }
    }

    async update(id, data) {
        try {
            const product = await this.Product.findByPk(id);
            if (!product) return null;
            return await product.update(data);
        } catch (error) {
            throw error;
        }
    }

    async delete(id) {
        try {
            const product = await this.Product.findByPk(id);
            if (!product) return null;
            await product.destroy();
            return true;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ProductService;