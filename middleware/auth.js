// middleware/auth.js

const isAuthenticated = (req, res, next) => {
    if (req.session.adminId) {
        return next();
    } else {
        return res.redirect('/login');
    }
};

module.exports = { isAuthenticated };
