exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find admin by email
        const admin = await Admin.findOne({ email });

        // If admin not found
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        // Compare provided password with stored hashed password
        const isMatch = await bcrypt.compare(password, admin.password);

        if (isMatch) {
            // Store admin information in session
            req.session.adminId = admin._id;
            req.session.email = admin.email;

            // Redirect to the dashboard after successful login
            return res.redirect('/dashboard');
        } else {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};
