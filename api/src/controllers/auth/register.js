const knex = require('../../database/connection');
const bcrypt = require('bcrypt');
const Validator = require('validatorjs');
const messagesValidator = require('../../validators/messages');

module.exports = async (req, res) => {
    let ret = req.ret;
    ret.addFields(['name', 'email', 'password']);

    try {
        let { name, email, password } = req.body;

        // Validando formulário
        const dataValidate = new Validator({
            name,
            email,
            password,
        }, {
            name: 'required|string|min:3',
            email: 'required|string|email',
            password: 'required|string|min:6',
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
        const userExists = await knex('users')
            .where('deleted_at', null)
            .where('email', email)
            .first();

        if (userExists) {
            ret.setCode(400);
            ret.setFieldError('email', true, 'Já existe um usuário cadastrado com esse e-mail.');
            throw new Error('Verifique todos os campos.');
        }

        // Criptografando senha
        const saltLength = Number(process.env.AUTH_SALT_LENGTH);
        const salt = bcrypt.genSaltSync(saltLength);
        password = bcrypt.hashSync(password, salt);

        // Criando novo registro
        const userId = (await knex('users').insert({
            name,
            email,
            password,
            salt,
        }))[0];

        // Criando novo perfil
        const profileId = (await knex('profiles').insert({
            user_id: userId,
        }))[0];

        const insertedUser = await knex('users')
            .where('user_id', userId)
            .select('user_id', 'name', 'email', 'active')
            .first();

        ret.addContent('user', insertedUser);

        ret.setCode(201);
        ret.addMessage('Usuário adicionado com sucesso!');
    } catch (err) {
        ret = require('../../helpers/error-handler')(err, ret);
    }

    res.status(ret.getCode()).json(ret.generate());
};
