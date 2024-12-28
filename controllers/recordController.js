// controllers/recordController.js
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const Record = require('../models/record');

// Handle file upload and save to DB
exports.uploadExcel = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        // Parse the Excel file
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // Insert the parsed data into the `records` collection
        const records = await Record.insertMany(data);
        console.log('Data inserted:', records);

        // Delete the uploaded file
        fs.unlinkSync(req.file.path);

        res.status(200).json({ message: 'File uploaded and data saved!', records });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ error: 'Failed to process file' });
    }
};

// Fetch all records for rendering in the table
exports.getRecords = async (req, res) => {
    try {
        const records = await Record.find({});
        res.status(200).json(records);
    } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).json({ error: 'Failed to fetch records' });
    }
};
