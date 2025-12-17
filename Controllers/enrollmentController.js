const Enrollment = require('../Models/enrollmentModel');
const Dance = require('../Models/danceModel');

// Get available classes for enrollment
const getAvailableClasses = async (req, res) => {
    try {
        const classes = await Dance.find().sort({ createdAt: -1 });
        res.status(200).json(classes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch classes' });
    }
};

// Enroll in a class
const enrollInClass = async (req, res) => {
    try {
        const { studentName, email, phone, classId, className } = req.body;
        
        if (!studentName || !email || !phone || !classId || !className) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        // Check if class exists
        const danceClass = await Dance.findById(classId);
        if (!danceClass) {
            return res.status(404).json({ error: 'Class not found' });
        }
        
        // Create enrollment
        const enrollment = new Enrollment({
            studentName,
            email,
            phone,
            classId,
            className
        });
        
        await enrollment.save();
        
        // Update student count in class
        await Dance.findByIdAndUpdate(classId, { 
            $inc: { students: 1 } 
        });
        
        res.status(201).json({ message: 'Enrollment successful' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to enroll in class' });
    }
};

// Get all enrollments (admin)
const getAllEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find().sort({ createdAt: -1 });
        res.status(200).json(enrollments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch enrollments' });
    }
};

module.exports = { getAvailableClasses, enrollInClass, getAllEnrollments };