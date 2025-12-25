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
        console.log('Enrollment request received:', req.body);
        const { name, email, phone, age, experience, address, classId, className, instructor, schedule, fee } = req.body;
        
        if (!name || !email || !phone || !className) {
            console.log('Missing required fields:', { name, email, phone, className });
            return res.status(400).json({ error: 'Name, email, phone, and className are required' });
        }
        
        // Check if class exists (if classId provided)
        if (classId) {
            console.log('Checking if class exists with ID:', classId);
            const danceClass = await Dance.findById(classId);
            if (!danceClass) {
                console.log('Class not found with ID:', classId);
                return res.status(404).json({ error: 'Class not found' });
            }
            console.log('Class found:', danceClass.name);
        }
        
        // Create enrollment
        console.log('Creating enrollment record...');
        const enrollment = new Enrollment({
            studentName: name,
            email,
            phone,
            classId: classId || null,
            className,
            age,
            experience,
            address,
            instructor,
            schedule,
            fee
        });
        
        console.log('Saving enrollment to database...');
        const savedEnrollment = await enrollment.save();
        console.log('Enrollment saved successfully:', savedEnrollment._id);
        
        // Update student count in class if classId exists
        if (classId) {
            console.log('Updating student count for class:', classId);
            await Dance.findByIdAndUpdate(classId, { 
                $inc: { students: 1 } 
            });
            console.log('Student count updated');
        }
        
        res.status(201).json({ message: 'Enrollment successful', enrollmentId: savedEnrollment._id });
    } catch (error) {
        console.error('Enrollment error details:', error.message);
        console.error('Full enrollment error:', error);
        res.status(500).json({ error: 'Failed to enroll in class', details: error.message });
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