const addAluminiModel = require("../models/recordModels");

exports.addNewAlumni = async (req, res) => {
    try {
        const { name, usn, company, batch, status } = req.body;

        // Validate if all required fields are provided
        if (!name || !usn || !company || !batch || !status) {
            return res.status(400).json({ error: 'Name, USN, Company, Batch, and Status are required fields' });
        }

        // Check if the alumni already exists
        const existingAlumni = await addAluminiModel.findOne({ usn });
        if (existingAlumni) {
            return res.status(400).json({ error: 'Alumni already exists with this USN' });
        }

        // Find the smallest vacant slNo
        const existingSlNos = await addAluminiModel.find({}, 'slNo').sort('slNo');
        let vacantSlNo = 1;

        // Check for the first vacant slNo
        for (let i = 0; i < existingSlNos.length; i++) {
            if (existingSlNos[i].slNo !== vacantSlNo) {
                break; // Found vacant slNo
            }
            vacantSlNo++;
        }

        // Create a new alumni record with all fields
        const newAlumni = new addAluminiModel({
            name,
            usn,
            company,
            batch,
            status, // Added the status field
            slNo: vacantSlNo // Assign the next vacant serial number
        });

        // Save the new alumni to the database
        await newAlumni.save();

        // Return success response
        return res.status(201).json({ message: 'Alumni added successfully', alumni: newAlumni });

    } catch (error) {
        console.error('Error adding alumni:', error);
        return res.status(500).json({ error: 'Server error, please try again later' });
    }
};
