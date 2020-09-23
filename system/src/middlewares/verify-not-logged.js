const querystring = require("querystring");

module.exports = (req, res, next) => {
    if (!req.cookies.systemLogin) {
        return res.redirect('/login');
    }

    const token = req.cookies.systemLogin;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const buffer = new Buffer(base64, 'base64');
    const base64ToString = buffer.toString();
    const jsonPayload = querystring.unescape(base64ToString.split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const payload = JSON.parse(jsonPayload);

    req.auth = payload;

    next();
};
