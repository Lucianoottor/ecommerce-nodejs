var express = require('express');
var router = express.Router();

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

module.exports = router;