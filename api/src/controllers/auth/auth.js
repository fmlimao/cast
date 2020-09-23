const knex = require('../../database/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Validator = require('validatorjs');
const messagesValidator = require('../../validators/messages');

module.exports = async (req, res) => {
    let ret = req.ret;
    ret.addFields(['email', 'password']);

    try {
        let { email, password } = req.body;

        // Validando formulário
        const dataValidate = new Validator({
            email,
            password,
        }, {
            email: 'required|string|email',
            password: 'required|string',
        }, messagesValidator);

        const fails = dataValidate.fails();
        const errors = dataValidate.errors.all();

        if (fails) {
            for (let field in errors) {
                let messages = errors[field];
                ret.setFieldError(field, true);

                for (let i in messages) {
                    let message = messages[i];
                    ret.addFieldMessage(field, message);
                }
            }

            ret.setCode(400);
            throw new Error('Verifique todos os campos.');
        }

        // Verificando se usuário ja existe
        const user = await knex('users')
            .leftJoin('roles', 'users.role_id', 'roles.role_id')
            .where('users.deleted_at', null)
            .where('users.active', 1)
            .where('roles.deleted_at', null)
            .where('roles.active', 1)
            .where('users.email', email)
            .select('users.user_id AS id', 'users.name', 'users.email', 'users.password', 'roles.key AS role', 'users.request_password_change')
            .first();

        if (!user) {
            ret.setCode(400);
            throw new Error('Usuário não encontrado.');
        }

        const passwordVerify = bcrypt.compareSync(password, user.password);

        if (!passwordVerify) {
            ret.setCode(400);
            throw new Error('Usuário não encontrado.');
        }

        if (user.request_password_change) {
            const saltLength = Number(process.env.AUTH_SALT_LENGTH);
            const newSalt = bcrypt.genSaltSync(saltLength);
            const newPasswordResetHash = Buffer.from(user.email + newSalt).toString('base64');

            await knex('users')
                .where('user_id', user.id)
                .update({
                    'password_reset_hash': newPasswordResetHash,
                    'password_reset_date': knex.fn.now(),
                });

            ret.setCode(400);
            ret.addContent('resetPasswordUrl', {
                method: 'get',
                hash: newPasswordResetHash,
                url: `${process.env.APP_HOST}/auth/reset-password/${newPasswordResetHash}`,
            });

            throw new Error('Foi solicitada uma troca imediata da senha.');
        }

        const login = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };

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
