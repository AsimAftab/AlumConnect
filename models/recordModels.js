const mongoose = require("mongoose");
const moment = require("moment-timezone");

// Define the schema for the data
const recordSchema = new mongoose.Schema({
    slNo: { type: Number, required: true}, // Serial Number
    name: { type: String, required: true },
    company: { type: String, required: true },
    usn : { type: String, required: true, unique: true},
    dateUpdated: {
        type: String, // Store as string to keep only the date part
        default: () => moment().tz("Asia/Kolkata").format("YYYY-MM-DD") // Set default as current date in specific timezone
    }, // Automatically adds the current date
    batch: { type: Number, required: true },
    status: { type: String, required: true },
    requestUpdate: { type: String, default: "Request Update" }
},{collection: 'records', timestamps: true});

// Pre-save middleware to generate Sl.No automatically
recordSchema.pre("save", async function (next) {
    if (!this.slNo) {
        const count = await mongoose.model("Record").countDocuments();
        this.slNo = count + 1; // Set Sl.No as count + 1
    }
    next();
});

// Export the model
module.exports = mongoose.model("Record", recordSchema);
