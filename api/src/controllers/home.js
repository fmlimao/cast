module.exports = (req, res) => {
    let ret = req.ret;

    try {
        ret.addContent('status', 'ok');
    } catch (err) {
        ret = require('../helpers/error-handler')(err, ret);
    }

    res.status(ret.getCode()).json(ret.generate());
};
