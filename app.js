var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');


const db = require('./models');

const v1IndexRouter = require('./routes/v1/index');

var app = express(); 

app.use(logger('dev'));
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/v1', v1IndexRouter);

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

const PORT = process.env.PORT || 3000; // Changed from 8080 to 3000 to match Docker
const HOST = '0.0.0.0';                // Forces the app to accept external container traffic

app.listen(PORT, HOST, () => {
    console.log(`Servidor rodando em http://${HOST}:${PORT}`);
})

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado!');
});

module.exports = app;