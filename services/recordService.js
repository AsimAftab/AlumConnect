const xlsx = require('xlsx');
const Record = require('../models/recordModels');
const moment = require('moment-timezone');

class RecordService {
    /**
     * Process Excel data from a buffer.
     * @param {Buffer} buffer - The buffer of the Excel file.
     * @returns {Array} Array of transformed records.
     */
    async processExcelBuffer(buffer) {
        try {
            // Read workbook from buffer
            const workbook = xlsx.read(buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

            // Transform data to match schema
            const records = data.map(record => ({
                name: record.Name || record.name || 'Unknown', // Default value if missing
                company: record.Company || record.company || 'N/A',
                usn: record.Usn || record.usn || 'Unknown',
                dateUpdated: moment(record.DateUpdated || record.dateUpdated || Date.now())
                    .tz('Asia/Kolkata')
                    .format('YYYY-MM-DD'),
                batch: record.Batch || record.batch || 'Unknown',
                status: (record.Status || record.status || 'Unknown')
                    .trim()
                    .toLowerCase()
                    .replace(/\b\w/g, char => char.toUpperCase()),
                requestUpdate: record.RequestUpdate === 'true' || record.RequestUpdate === true || false,
                slNo: record.slNo || 'N/A', // Default if slNo is missing
            }));

            return records;
        } catch (error) {
            console.error('Error processing Excel buffer:', error);
            throw new Error('Failed to process Excel file');
        }
    }

    /**
     * Save multiple records to the database.
     * @param {Array} records - Array of records to save.
     * @returns {Promise} Promise resolving with saved records.
     */
    async saveRecords(records) {
        try {
            if (records.length > 0) {
                return await Record.insertMany(records);
            } else {
                throw new Error('No valid records to save.');
            }
        } catch (error) {
            console.error('Error saving records:', error);
            throw error;
        }
    }

    /**
     * Retrieve all records with optional filters.
     * @param {Object} filters - MongoDB query filters.
     * @returns {Promise} Promise resolving with the records.
     */
    async getAllRecords(filters = {}) {
        try {
            return await Record.find(filters).sort({ dateUpdated: -1 });
        } catch (error) {
            console.error('Error fetching records:', error);
            throw error;
        }
    }

    /**
     * Retrieve paginated records.
     * @param {Number} page - Current page number.
     * @param {Number} limit - Number of records per page.
     * @param {Object} filters - MongoDB query filters.
     * @returns {Object} Object containing paginated records and total record count.
     */
    async getPaginatedRecords(page = 1, limit = 5, filters = {}) {
        try {
            const skip = (page - 1) * limit;
            const records = await Record.find(filters)
                .skip(skip)
                .limit(limit)
                .sort({ dateUpdated: -1 });
            const totalRecords = await Record.countDocuments(filters);

            return { records, totalRecords };
        } catch (error) {
            console.error('Error fetching paginated records:', error);
            throw error;
        }
    }

    /**
     * Get dashboard statistics.
     * @returns {Object} Object containing dashboard statistics.
     */
    async getDashboardStats() {
        try {
            const records = await this.getAllRecords();

            return {
                alumniCount: records.length,
                higherStudiesCount: records.filter(record => record.status === 'Higher Studies').length,
                placedCount: records.filter(record => record.status === 'Placed').length,
                entrepreneurCount: records.filter(record => record.status === 'Entrepreneur').length,
            };
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            throw error;
        }
    }

    /**
     * Update a specific record.
     * @param {String} id - ID of the record to update.
     * @param {Object} data - Data to update.
     * @returns {Promise} Promise resolving with the updated record.
     */
    async updateRecord(id, data) {
        try {
            return await Record.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            console.error('Error updating record:', error);
            throw error;
        }
    }

    /**
     * Delete a specific record.
     * @param {String} id - ID of the record to delete.
     * @returns {Promise} Promise resolving with the deleted record.
     */
    async deleteRecord(id) {
        try {
            return await Record.findByIdAndDelete(id);
        } catch (error) {
            console.error('Error deleting record:', error);
            throw error;
        }
    }
}

module.exports = new RecordService();
