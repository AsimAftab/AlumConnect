const Admin = require('../models/admin'); // Adjust based on your structure
const bcrypt = require('bcryptjs');  // Use 'bcryptjs' for consistency (or 'bcrypt' if you're using that)

// Controller to handle GET requests for /login (e.g., render login page)
exports.getLogin = (req, res) => {
    res.render('login'); // Ensure 'login' is the name of your view/template
};

// Controller to handle POST requests for /login (authentication)
exports.postLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find admin by email in the database
        const admin = await Admin.findOne({ email });

        // If no admin is found
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        // Compare provided password with the stored password
        const isMatch = await bcrypt.compare(password, admin.password);

        if (isMatch) {
            // Store user information in the session
            req.session.adminId = admin._id;
            req.session.email = admin.email;

            // Redirect to the dashboard or another protected route
            return res.redirect('/dashboard');
        } else {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};
