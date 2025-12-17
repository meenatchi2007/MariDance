const mongoose = require("mongoose");

const danceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    instructor: { type: String, required: true },
    schedule: { type: String, required: true },
    students: { type: Number, default: 0 },
    description: String,
    duration: String,
    price: Number
}, { timestamps: true });

module.exports = mongoose.model("Dance", danceSchema);