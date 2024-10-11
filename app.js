var express = require('express'); // Para as rotas
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');

// Importando o Sequelize
const db = require('./models');

var indexRouter = require('./routes/index'); // Rota principal
var usersRouter = require('./routes/users'); // Rota de usuários
var productsRouter = require('./routes/products'); // Rota de produtos
var paymentRouter = require('./routes/payment'); // Rota de pagamento
const cartRouter = require('./routes/cart'); // Rota do carrinho

var app = express(); // Ativa a API com o Express

// Middleware
app.use(logger('dev'));
app.use(express.json()); // Permite o uso de JSON
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Rotas
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/cart', cartRouter);
app.use('/payment', paymentRouter);

// Função para sincronizar o banco de dados
async function applyDataStructure() {
    try {
        await db.sequelize.sync({ alter: true });
        console.log('Banco de dados sincronizado');
    } catch (err) {
        console.error('Erro ao sincronizar o banco de dados:', err);
    }
}

// Aplicando a estrutura de dados
applyDataStructure();

// Iniciar o servidor
const PORT = process.env.PORT || 8080; // Porta configurável
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado!');
});

module.exports = app;