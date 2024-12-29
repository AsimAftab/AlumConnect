const xlsx = require('xlsx');
const Record = require('../models/record');
const moment = require('moment-timezone');

class RecordService {
    // Process and save Excel data
    async processExcelFile(filePath) {
        try {
            // Read the Excel file
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

            // Transform data to match your schema
            const records = data.map(record => {
                return {
                    name: record.Name || record.name,
                    company: record.Company || record.company,
                    // Ensure dateUpdated is formatted as 'YYYY-MM-DD' with the specific timezone
                    dateUpdated: moment(record.DateUpdated || record.dateUpdated || Date.now())
                        .tz("Asia/Kolkata") // Use your desired timezone here
                        .format("YYYY-MM-DD"), // Format it as 'YYYY-MM-DD'
                    batch: record.Batch || record.batch,
                    status: record.Status || record.status,
                    requestUpdate: record.RequestUpdate === 'true' || false,
                    slNo: record.slNo, // Provide a default value if slNo is missing
                };
            });

            return records; // Return transformed records for saving
        } catch (error) {
            console.error('Error processing Excel file:', error);
            throw error;
        }
    }

    // Save records to the database
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

    // Get all records with optional filtering
    async getAllRecords(filters = {}) {
        try {
            return await Record.find(filters).sort({ dateUpdated: -1 });
        } catch (error) {
            console.error('Error fetching records:', error);
            throw error;
        }
    }

    // Get dashboard statistics
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

    // Update a specific record
    async updateRecord(id, data) {
        try {
            return await Record.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            console.error('Error updating record:', error);
            throw error;
        }
    }

    // Delete a specific record
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
