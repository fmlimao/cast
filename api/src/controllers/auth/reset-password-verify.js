require("dotenv-safe").config();
const knex = require('../../database/connection');
const moment = require('moment');

module.exports = async (req, res) => {
    let ret = req.ret;

    try {
        const { hash } = req.params;

        const user = await knex('users')
            .where('deleted_at', null)
            .where('active', 1)
            .where('password_reset_hash', hash)
            .first();

        if (!user) {
            ret.setCode(404);
            throw new Error('Link inválido.');
        }

        var currentDatetime = moment().format();
        var resetDatetime = user.password_reset_date;
        var startDate = moment(resetDatetime, 'YYYY-MM-DD HH:mm:ss');
        var endDate = moment(currentDatetime, 'YYYY-MM-DD HH:mm:ss');
        var duration = moment.duration(endDate.diff(startDate));
        var hours = duration.asHours();

        if (hours > 1) {
            ret.setCode(400);
            throw new Error('Link expirado. Por favor, solicite a troca de senha novamente.');
        }

        ret.addMessage('Link válido.');
    } catch (err) {
        ret = require('../../helpers/error-handler')(err, ret);
    }

    return res.status(ret.getCode()).json(ret.generate());
};
