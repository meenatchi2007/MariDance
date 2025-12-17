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
        console.log('Request body:', req.body);
        const { name, email, phone, role } = req.body;
        
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        
        const bcrypt = require('bcryptjs');
        const defaultPassword = await bcrypt.hash('password123', 10);
        
        const newUser = new User({
            firstname: name,
            email,
            phone,
            password: defaultPassword
        });
        
        const savedUser = await newUser.save();
        res.status(201).json({ 
            id: savedUser._id,
            name: savedUser.firstname,
            email: savedUser.email,
            phone: savedUser.phone,
            role: role || 'Student'
        });
    } catch (error) {
        console.error('Add user error:', error);
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
        const formattedClasses = classes.map(cls => ({
            id: cls._id,
            name: cls.name,
            instructor: cls.instructor,
            schedule: cls.schedule,
            students: cls.students
        }));
        res.status(200).json(formattedClasses);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch classes' });
    }
};

// Add new dance class
const addClass = async (req, res) => {
    try {
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
        res.status(500).json({ error: 'Failed to add class' });
    }
};

// Delete dance class
const deleteClass = async (req, res) => {
    try {
        await Dance.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Class deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete class' });
    }
};

// Update dance class
const updateClass = async (req, res) => {
    try {
        const { name, instructor, schedule, students } = req.body;
        const updatedClass = await Dance.findByIdAndUpdate(
            req.params.id,
            { name, instructor, schedule, students },
            { new: true }
        );
        res.status(200).json({
            id: updatedClass._id,
            name: updatedClass.name,
            instructor: updatedClass.instructor,
            schedule: updatedClass.schedule,
            students: updatedClass.students
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update class' });
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