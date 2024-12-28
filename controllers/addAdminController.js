const bcrypt = require('bcryptjs');
const adminModels = require('../models/adminModels'); // Import your admin model

exports.addNewAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the admin already exists
    const existingAdmin = await adminModels.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin already exists' });
    }


    // Create a new admin object with hashed password
    const newAdmin = new adminModels({
      name,
      email,
      password,
    });

    // Save the new admin to the database
    await newAdmin.save();

    // Send a success response
    res.status(201).json({ message: 'Admin created successfully', admin: newAdmin });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};
