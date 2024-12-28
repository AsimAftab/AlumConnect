const mongoose = require('mongoose');

const recordsSchema = new mongoose.Schema({
    name: String,
    company: String,
    dateUpdated: Date,
    batch: String,
    status: String,
    requestUpdate: Boolean,
}, { collection: 'records',timestamps: true });

module.exports = mongoose.model('Record', recordsSchema);