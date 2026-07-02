class ProductService {
    constructor(ProductModel) {
        this.Product = ProductModel;
    }

    async create(name, description, price, stock, imageUrl) {
        try {
            return await this.Product.create({ name, description, price, stock, imageUrl });
        } catch (error) {
            throw error;
        }
    }

    async findAll({ page = 1, limit = 20 } = {}) {
        try {
            const offset = (page - 1) * limit;
            const { count, rows } = await this.Product.findAndCountAll({
                limit,
                offset,
                order: [['productId', 'ASC']]
            });

            return {
                products: rows,
                pagination: {
                    page,
                    limit,
                    total: count,
                    totalPages: Math.ceil(count / limit)
                }
            };
        } catch (error) {
            throw error;
        }
    }

    async findById(id) {
        try {
            return await this.Product.findByPk(id);
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
