// middleware/authMiddleware.js

module.exports = (req, res, next) => {
    if (req.session.adminId) {
        return next(); // User is authenticated, proceed to the next middleware or route handler
    } else {
        if (req.xhr || req.headers.accept.includes('application/json')) {
            // If the request is an AJAX request or expects a JSON response
            return res.status(401).json({ error: 'Admin not authenticated' });
        } else {
            // Otherwise, redirect to the login page
            return res.redirect('/login');
        }
    }
};
