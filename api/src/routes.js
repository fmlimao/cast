const express = require('express');

const router = express.Router();

router.get('/', require('./controllers/home'));

/* Middlewares */
const middlewareAuth = require('./middlewares/auth');

// Autenticação
router.post('/auth', require('./controllers/auth/auth'));

// Usuários do sistema
router.post('/users', require('./controllers/users/store'));

module.exports = router;
