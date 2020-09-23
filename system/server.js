require('dotenv-safe').config();

const express = require('express');
const logger = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
const axios = require('axios');

const app = express();

app.use('/assets', express.static(path.join(__dirname, './public')));
app.use('/scripts', express.static(path.join(__dirname, './node_modules')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './src/views'))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(cookieParser());

const middlwareVerifyLogged = require('./src/middlewares/verify-logged');
const middlwareVerifyNotLogged = require('./src/middlewares/verify-not-logged');
const middlwareJsonReturn = require('./src/middlewares/json-return');

app.use(middlwareJsonReturn);

app.use((req, res, next) => {
    req.apiHost = process.env.API_HOST;
    next();
});

app.get('/login', middlwareVerifyLogged, (req, res) => {
    return res.render('login', {
        title: `${process.env.APP_TITLE} - Login`,
        apiHost: req.apiHost,
    });
});

app.get('/register', middlwareVerifyLogged, (req, res) => {
    return res.render('register', {
        title: `${process.env.APP_TITLE} - Criar Conta`,
        apiHost: req.apiHost,
    });
});

app.get('/forgot-password', middlwareVerifyLogged, (req, res) => {
    return res.render('forgot-password', {
        title: `${process.env.APP_TITLE} - Esqueci minha Senha`,
        apiHost: req.apiHost,
    });
});

app.get('/reset-password/:hash', middlwareVerifyLogged, (req, res) => {
    const { hash } = req.params;
    const url = `${process.env.API_HOST}/auth/reset-password/${hash}`;

    axios
        .get(url)
        .then(ajaxResponse => {
            return res.render('reset-password', {
                title: `${process.env.APP_TITLE} - Alterar Senha`,
                apiHost: req.apiHost,
                hash: hash,
                expired: false,
                messages: [],
            });
        })
        .catch(ajaxError => {
            if (ajaxError.response.data.code == 404) {
                return res.render('error-404', {
                    title: `${process.env.APP_TITLE} - Página não encontrada`,
                });
            } else {
                return res.render('reset-password', {
                    title: `${process.env.APP_TITLE} - Alterar Senha`,
                    apiHost: req.apiHost,
                    hash: hash,
                    expired: true,
                    messages: ajaxError.response.data.messages,
                });
            }
        });

});

app.post('/save-session', (req, res) => {
    let ret = req.ret;
    ret.addFields(['token']);

    try {
        let { token } = req.body;

        if (!token) {
            ret.setFieldError('token', true, 'Campo obrigatório.');
            ret.setCode(400);
            throw new Error('Verifique todos os campos.');
        }

        res.cookie('systemLogin', token);

        console.log('req.cookies.systemLogin', req.cookies.systemLogin);
    } catch (err) {
        ret.setError(true);
        if (ret.getCode() === 200) {
            ret.setCode(500);
            ret.addMessage('Erro interno. Por favor, tente novamente.');

            console.log(`[ERRO INTERNO]: ${err}`);
        } else {
            if (err.message) {
                ret.addMessage(err.message);
            }
        }
    }

    return res.status(ret.getCode()).json(ret.generate());
});

app.get('/logout', middlwareVerifyNotLogged, (req, res) => {
    res.clearCookie('systemLogin');
    return res.redirect('/login');
});

app.use(expressLayouts);
app.set('layout', 'layout');

app.get('/', middlwareVerifyNotLogged, (req, res) => {
    if (req.auth.role == 'cast') {
        return res.redirect('/profile');
    }

    return res.render('home', {
        title: `${process.env.APP_TITLE} - Home`,
        auth: req.auth,
    });
});

app.use((req, res, next) => {
    if (!req.cookies.systemLogin) {
        return res.render('error-404', {
            title: `${process.env.APP_TITLE} - Página não encontrada`,
        });
    }
});

app.listen(process.env.APP_PORT, () => {
    console.log(`Servidor rodando na porta ${process.env.APP_PORT}`);
});
