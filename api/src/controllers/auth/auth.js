const knex = require('../../database/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
    let ret = req.ret;
    ret.addFields(['email', 'password']);

    try {
        let { email, password } = req.body;

        let hasError = false;

        if (!email) {
            hasError = true;
            ret.setFieldError('email', true, 'Campo obrigatório');
        }

        if (!password) {
            hasError = true;
            ret.setFieldError('password', true, 'Campo obrigatório');
        }

        if (hasError) {
            ret.setCode(400);
            throw new Error('Verifique todos os campos.');
        }

        // Verificando se usuário ja existe
        const user = await knex('users')
            .where('deleted_at', null)
            .where('email', email)
            .first();

        if (!user) {
            ret.setCode(400);
            throw new Error('Login inválido.');
        }

        const passwordVerify = bcrypt.compareSync(password, user.password);

        if (!passwordVerify) {
            ret.setCode(400);
            throw new Error('Login inválido.');
        }

        const login = {
            id: user.user_id,
        }

        const exp = Number(process.env.TOKEN_EXPIRATION_SEC);
        if (exp) {
            login.exp = Math.floor(Date.now() / 1000) + exp;
        }

        const key = process.env.TOKEN_SECRET;
        const token = jwt.sign(login, key);

        ret.addContent('token', token);
    } catch (err) {
        ret = require('../../helpers/error-handler')(err, ret);
    }

    res.status(ret.getCode()).json(ret.generate());
};
