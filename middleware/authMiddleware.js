// middleware/authMiddleware.js
module.exports = (req, res, next) => {
    if (!req.session.adminId) {
        return res.status(401).json({ error: 'Admin not authenticated' });
    }
    next(); // Continue to the next middleware/route handler
};


const ensureAuthenticated = (req, res, next) => {
    if (req.session.adminId) {
        return next();
    }
    res.redirect('/login');
};

app.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard'); // Replace 'dashboard' with your actual view/template
});
