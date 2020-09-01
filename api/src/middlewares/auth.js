const jwt = require('jsonwebtoken');
const knex = require('../database/connection');

module.exports = async (req, res, next) => {
    const ret = req.ret;

    try {
        const token = req.header('x-access-token');

        if (!token) {
            ret.setCode(401);
            throw new Error('Token inválido.');
        }

        const key = process.env.TOKEN_SECRET;
        const decodedToken = jwt.verify(token, key);

        const user = await knex('users')
            .where('deleted_at', null)
            .where('active', 1)
            .where('user_id', decodedToken.id)
            .select('user_id', 'name', 'email', 'active')
            .first();

        if (!user) {
            ret.setCode(401);
            throw new Error('Token inválido.');
        }

        req.auth = { user };
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            ret.setCode(401);
            throw new Error('Token inválido.');
        } else if (err.name === 'TokenExpiredError') {
            ret.setCode(401);
            ret.addMessage('Token expirado.');
        } else {
            ret.setError(true);

            if (err.message) {
                ret.addMessage(err.message);
            }
        }

        return res.status(ret.getCode()).json(ret.generate());
    }

    next();
};
