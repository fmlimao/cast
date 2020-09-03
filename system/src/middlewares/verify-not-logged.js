module.exports = (req, res, next) => {
    if (!req.cookies.systemLogin) {
        return res.redirect('/login');
    }

    next();
};
