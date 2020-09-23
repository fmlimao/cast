const JsonReturn = require('../helpers/json-return');

module.exports = (req, res, next) => {
    const ret = new JsonReturn();
    req.ret = ret;
    next();
};
