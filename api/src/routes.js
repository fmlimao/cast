const express = require('express');

const router = express.Router();

router.get('/', require('./controllers/home'));

/* Middlewares */
const middlewareAuth = require('./middlewares/auth');

// Autenticação
router.post('/auth', require('./controllers/auth/auth'));
router.get('/auth/reset-password/:hash', require('./controllers/auth/reset-password-verify'));
router.post('/auth/reset-password/:hash', require('./controllers/auth/reset-password'));
router.post('/auth/forgot-password', require('./controllers/auth/forgot-password'));

// Usuários do sistema
router.post('/users', require('./controllers/users/store'));

module.exports = router;
