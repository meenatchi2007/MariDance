const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dance', required: true },
    className: { type: String, required: true },
    enrollmentDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model("Enrollment", enrollmentSchema);