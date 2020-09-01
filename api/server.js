require('dotenv-safe').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('morgan');

const app = express();

app.use(helmet());
app.use(cors());
app.use(logger('dev'));

// Middlaware de Retorno JSON
app.use(require('./src/middlewares/json-return'));

// Rotas
app.use(require('./src/routes'));

app.use(require('./src/middlewares/error-404'));
app.use(require('./src/middlewares/error-500'));

app.listen(process.env.APP_PORT, () => {
    console.log(`Servidor rodando na porta ${process.env.APP_PORT}`);
});
