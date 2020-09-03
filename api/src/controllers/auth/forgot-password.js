require("dotenv-safe").config();
const knex = require('../../database/connection');
const bcrypt = require('bcrypt');
const Validator = require('validatorjs');
const messagesValidator = require('../../validators/messages');

module.exports = async (req, res) => {
    let ret = req.ret;
    ret.addFields(['email']);

    try {
        const { email } = req.body;

        // Validando formulário
        const dataValidate = new Validator({
            email,
        }, {
            email: 'required|string|email',
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

        const user = await knex('users')
            .where('deleted_at', null)
            .where('active', 1)
            .where('email', email)
            .first();

        if (!user) {
            ret.setCode(400);
            throw new Error('Usuário não encontrado.');
        }

        const saltLength = Number(process.env.AUTH_SALT_LENGTH);
        const newSalt = bcrypt.genSaltSync(saltLength);
        const newPasswordResetHash = Buffer.from(user.email + newSalt).toString('base64');

        await knex('users')
            .where('user_id', user.user_id)
            .update({
                'password_reset_hash': newPasswordResetHash,
                'password_reset_date': knex.fn.now(),
            });

        // TODO: Enviar email com link para troca de senha.

        ret.addMessage('Um e-mail foi enviado com o link para troca de senha.');
        ret.addContent('resetPasswordUrl', {
            method: 'get',
            url: `${process.env.APP_HOST}/auth/reset-password/${newPasswordResetHash}`,
        });

        return res.status(ret.getCode()).json(ret.generate());
    } catch (err) {
        ret = require('../../helpers/error-handler')(err, ret);
    }

    res.status(ret.getCode()).json(ret.generate());
};
