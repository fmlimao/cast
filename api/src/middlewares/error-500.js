module.exports = (err, req, res, next) => {
    const ret = require('../helpers/error-handler')(err, req.ret);
    res.status(ret.getCode()).json(ret.generate());
};
