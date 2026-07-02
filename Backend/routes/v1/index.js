var express = require('express');
var router = express.Router();

const db = require('../../models');
const auth = require('../../middleware/auth');
const rbacMiddleware = require('../../middleware/rbac');

const usersRouter = require('./users');
const productsRouter = require('./products');
const paymentRouter = require('./payment');
const cartRouter = require('./cart');

router.use('/users', usersRouter);
router.use('/products', productsRouter);
router.use('/cart', cartRouter);
router.use('/payment', paymentRouter);

router.get('/', (req, res) => {
    res.json({
        version: "1.0",
        status: "operational",
        message: "Welcome to API v1"
    });
});

router.get('/health', async (req, res) => {
    try {
        await db.sequelize.authenticate();
        res.json({ status: 'ok', uptime: process.uptime(), db: 'connected' });
    } catch (error) {
        res.status(503).json({ status: 'error', uptime: process.uptime(), db: 'disconnected' });
    }
});

router.get('/admin/stats', auth.verifyToken, rbacMiddleware.checkPermission('read_user'), async (req, res) => {
    try {
        const totalOrders = await db.Transaction.count();
        const revenueResult = await db.Transaction.sum('totalAmount', { where: { status: 'completed' } });
        const totalProducts = await db.Product.count();
        const totalStock = await db.Product.sum('stock');

        res.json({
            data: {
                totalOrders,
                totalRevenue: revenueResult || 0,
                totalProducts,
                totalStock: totalStock || 0,
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message, statusCode: 500 });
    }
});

module.exports = router;
