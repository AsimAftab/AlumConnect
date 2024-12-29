const fs = require('fs').promises;
const recordService = require('../services/recordService');

// Handle Excel file upload
exports.uploadExcel = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Process the uploaded Excel file
        const records = await recordService.processExcelFile(req.file.path);

        // Save processed records to the database
        await recordService.saveRecords(records);

        // Delete the file after successful processing
        await fs.unlink(req.file.path);

        if (req.xhr || req.headers.accept.includes('json')) {
            res.status(200).json({
                success: true,
                message: 'File uploaded and processed successfully'
            });
        } else {
            res.redirect('/dashboard'); // Redirect to dashboard or another page after successful upload
        }

    } catch (error) {
        console.error('Upload error:', error);

        // Attempt to delete the file if processing fails
        if (req.file && req.file.path) {
            await fs.unlink(req.file.path).catch((unlinkError) => {
                console.error('Failed to delete file after error:', unlinkError);
            });
        }

        if (req.xhr || req.headers.accept.includes('json')) {
            res.status(500).json({
                success: false,
                error: 'Failed to process file',
                details: error.message
            });
        } else {
            res.status(500).render('error', { message: 'File upload failed', error: error });
        }
    }
};

// Render the dashboard page with statistics
exports.getDashboard = async (req, res) => {
    try {
        const users = await recordService.getAllRecords();
        const stats = await recordService.getDashboardStats();

        res.render('dashboard', {
            users: users,
            isNoData: users.length === 0,
            alumniCount: stats.alumniCount || 0,
            higherStudiesCount: stats.higherStudiesCount || 0,
            placedCount: stats.placedCount || 0,
            entrepreneurCount: stats.entrepreneurCount || 0
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).render('error', { message: 'Error loading dashboard', error: error });
    }
};

// Fetch all records as JSON
exports.getRecords = async (req, res) => {
    try {
        const records = await recordService.getAllRecords();
        res.status(200).json(records);
    } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).json({ error: 'Failed to fetch records' });
    }
};
