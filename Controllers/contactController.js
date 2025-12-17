// contactController.js

const Contact = require('../Models/contactModel');

// Controller to handle contact form submissions
const handleContactForm = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Validate required fields
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Save the contact form data to the database
        const newContact = new Contact({ name, email, message });
        await newContact.save();

        res.status(201).json({ message: 'Contact form submitted successfully.' });
    } catch (error) {
        console.error('Error handling contact form:', error);
        res.status(500).json({ error: 'An error occurred while submitting the form.' });
    }
};

module.exports = { handleContactForm };