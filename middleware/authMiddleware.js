// Authentication middleware
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.adminId) {
        next();
    } else {
        if (req.xhr || req.headers.accept.includes('json')) {
            res.status(401).json({ error: 'Unauthorized' });
        } else {
            res.redirect('/login');
        }
    }
};

// Role-based authorization middleware
const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!req.session.adminRole) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        if (roles.length && !roles.includes(req.session.adminRole)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }

        next();
    };
};

// Error handling middleware
const handleErrors = (err, req, res, next) => {
    console.error(err.stack);

    if (req.xhr || req.headers.accept.includes('json')) {
        res.status(500).json({ error: 'Internal server error' });
    } else {
        res.status(500).render('error', { message: 'Something went wrong' });
    }
};

module.exports = {
    isAuthenticated,
    authorize,
    handleErrors
};