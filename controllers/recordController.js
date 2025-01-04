
const recordService = require('../services/recordService');

// Handle Excel file upload
// controllers/recordController.js
exports.uploadExcel = async (req, res) => {
    try {
        if (!req.file) {
            console.error('No file uploaded');
            return res.status(400).json({ error: 'No file uploaded' });
        }

        console.log('Uploaded file:', req.file.originalname);

        // Process the file directly from the buffer
        const records = await recordService.processExcelBuffer(req.file.buffer);
        console.log('Processed records:', records);

        // Try saving records to the database
        try {
            await recordService.saveRecords(records);
        } catch (error) {
            if (error.code === 11000) {
                // Duplicate key error
                const duplicateKeyError = error.message.match(/dup key: { : (\d+) }/);
                const duplicateSlNo = duplicateKeyError ? duplicateKeyError[1] : 'Unknown';

                console.error('Duplicate entry found for slNo: Ayush wait here', duplicateSlNo);
                return res.status(400).json({
                    success: false,
                    error: `Duplicate entry found for slNo: ${duplicateSlNo}`,
                });
            }

            // Handle other types of errors (e.g., validation errors, etc.)
            console.error('Error saving records:', error.message);
            return res.status(500).json({
                success: false,
                error: 'Failed to save records',
                details: error.message,
            });
        }

        // Respond with success if everything went fine
        res.status(200).json({
            success: true,
            message: 'File uploaded and processed successfully',
        });

    } catch (error) {
        console.error('Error during file upload:', error.message);

        res.status(500).json({
            success: false,
            error: 'Failed to process file',
            details: error.message,
        });
    }
};



// Render the dashboard page with statistics
// Render the dashboard page with statistics
exports.getDashboard = async (req, res) => {
    try {
        // Extract pagination parameters
        const page = parseInt(req.query.page, 10) || 1; // Default to page 1
        const limit = 5; // Set default limit to 5 records per page

        // Fetch paginated records and stats
        const { records: users, totalRecords } = await recordService.getPaginatedRecords(page, limit);
        const stats = await recordService.getDashboardStats();

        const totalPages = Math.ceil(totalRecords / limit); // Calculate total pages

        // Render the dashboard with all necessary variables
        res.render('dashboard', {
            users: users,
            isNoData: users.length === 0,
            alumniCount: stats.alumniCount || 0,
            higherStudiesCount: stats.higherStudiesCount || 0,
            placedCount: stats.placedCount || 0,
            entrepreneurCount: stats.entrepreneurCount || 0,
            currentPage: page, // Pass current page
            totalPages: totalPages, // Pass total pages
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
