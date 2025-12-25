const Contact = require('../Models/contactModel');
const User = require('../Models/signupModels');
const Dance = require('../Models/danceModel');

// Get all contacts for admin dashboard
const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch contacts' });
    }
};

// Get all users for admin dashboard
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        const formattedUsers = users.map(user => ({
            id: user._id,
            name: user.firstname,
            email: user.email,
            phone: user.phone,
            role: 'Student'
        }));
        res.status(200).json(formattedUsers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

// Get dashboard stats
const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalContacts = await Contact.countDocuments();
        const totalClasses = await Dance.countDocuments();
        
        res.status(200).json({
            totalUsers,
            totalContacts,
            totalClasses
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
};

// Add new user (admin function)
const addUser = async (req, res) => {
    try {
        console.log('Add user - Request body:', req.body);
        const { name, email, phone, role, password } = req.body;
        
        console.log('Extracted fields:', { name, email, phone, role, password: password ? '***' : 'not provided' });
        
        if (!name || !email) {
            console.log('Validation failed - missing name or email');
            return res.status(400).json({ error: 'Name and email are required' });
        }
        
        console.log('Checking for existing user with email:', email);
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists with email:', email);
            return res.status(400).json({ error: 'Email already exists' });
        }
        
        console.log('Hashing password...');
        const bcrypt = require('bcryptjs');
        const userPassword = password || 'password123'; // Use provided password or default
        const hashedPassword = await bcrypt.hash(userPassword, 10);
        
        console.log('Creating new user object...');
        const newUser = new User({
            firstname: name,
            email,
            phone,
            password: hashedPassword
        });
        
        console.log('Saving user to database...');
        const savedUser = await newUser.save();
        console.log('User saved successfully:', savedUser._id);
        
        res.status(201).json({ 
            id: savedUser._id,
            name: savedUser.firstname,
            email: savedUser.email,
            phone: savedUser.phone,
            role: role || 'Student'
        });
    } catch (error) {
        console.error('Add user error details:', error.message);
        console.error('Full error:', error);
        res.status(500).json({ error: 'Failed to add user', details: error.message });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

// Update user
const updateUser = async (req, res) => {
    try {
        const { name, email, phone, role } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { firstname: name, email, phone },
            { new: true }
        );
        res.status(200).json({
            id: updatedUser._id,
            name: updatedUser.firstname,
            email: updatedUser.email,
            phone: updatedUser.phone,
            role: role || 'Student'
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
};

// Get all dance classes
const getAllClasses = async (req, res) => {
    try {
        const classes = await Dance.find().sort({ createdAt: -1 });
        console.log('Found classes in database:', classes.length);
        
        const formattedClasses = classes.map(cls => {
            console.log('Class ID:', cls._id, 'Name:', cls.name);
            return {
                id: cls._id,
                name: cls.name,
                instructor: cls.instructor,
                schedule: cls.schedule,
                students: cls.students
            };
        });
        
        res.status(200).json(formattedClasses);
    } catch (error) {
        console.error('Get classes error:', error);
        res.status(500).json({ error: 'Failed to fetch classes' });
    }
};

// Add new dance class
const addClass = async (req, res) => {
    try {
        console.log('Add class request body:', req.body);
        const { name, instructor, schedule, students } = req.body;
        
        if (!name || !instructor || !schedule) {
            return res.status(400).json({ error: 'Name, instructor, and schedule are required' });
        }
        
        const newClass = new Dance({
            name,
            instructor,
            schedule,
            students: students || 0
        });
        
        const savedClass = await newClass.save();
        res.status(201).json({
            id: savedClass._id,
            name: savedClass.name,
            instructor: savedClass.instructor,
            schedule: savedClass.schedule,
            students: savedClass.students
        });
    } catch (error) {
        console.error('Add class error:', error);
        res.status(500).json({ error: 'Failed to add class', details: error.message });
    }
};

// Delete dance class
const deleteClass = async (req, res) => {
    try {
        const classId = req.params.id;
        console.log('Delete class request - ID:', classId);
        
        if (!classId || classId === 'undefined' || classId === 'null') {
            return res.status(400).json({ error: 'Valid class ID is required' });
        }
        
        const deletedClass = await Dance.findByIdAndDelete(classId);
        if (!deletedClass) {
            return res.status(404).json({ error: 'Class not found' });
        }
        
        console.log('Class deleted successfully:', deletedClass.name);
        res.status(200).json({ message: 'Class deleted successfully' });
    } catch (error) {
        console.error('Delete class error:', error);
        res.status(500).json({ error: 'Failed to delete class', details: error.message });
    }
};

// Update dance class
const updateClass = async (req, res) => {
    try {
        const classId = req.params.id;
        console.log('Update class request - ID:', classId, 'Body:', req.body);
        
        if (!classId || classId === 'undefined' || classId === 'null') {
            return res.status(400).json({ error: 'Valid class ID is required' });
        }
        
        // Check if it's a valid MongoDB ObjectId
        if (!classId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: 'Invalid class ID format' });
        }
        
        const { name, instructor, schedule, students } = req.body;
        
        if (!name || !instructor || !schedule) {
            return res.status(400).json({ error: 'Name, instructor, and schedule are required' });
        }
        
        const updatedClass = await Dance.findByIdAndUpdate(
            classId,
            { name, instructor, schedule, students: students || 0 },
            { new: true }
        );
        
        if (!updatedClass) {
            return res.status(404).json({ error: 'Class not found' });
        }
        
        console.log('Class updated successfully:', updatedClass.name);
        res.status(200).json({
            id: updatedClass._id,
            name: updatedClass.name,
            instructor: updatedClass.instructor,
            schedule: updatedClass.schedule,
            students: updatedClass.students
        });
    } catch (error) {
        console.error('Update class error:', error);
        res.status(500).json({ error: 'Failed to update class', details: error.message });
    }
};

module.exports = { 
    getAllContacts, 
    getAllUsers, 
    getDashboardStats, 
    addUser, 
    deleteUser, 
    updateUser,
    getAllClasses, 
    addClass, 
    deleteClass, 
    updateClass 
};