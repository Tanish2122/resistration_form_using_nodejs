const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const mongoose = require('mongoose');

// Create express app
const app = express();
const port = 5000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// MongoDB connection string (Replace with your actual connection string)
const mongoURI = 'mongodb+srv://bansaltanish12:12345@formdata.thfxv.mongodb.net/?retryWrites=true&w=majority&appName=formdata'; // Update this with your own MongoDB URI

// Connect to MongoDB
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Define the schema for form data
const formSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        match: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/
    },
    phone: {
        type: String,
        required: true,
        match: /^\d{10}$/
    },
    gender: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zipCode: {
        type: String,
        required: true,
        match: /^\d{6}$/
    }
});

// Create a model for the form data
const FormData = mongoose.model('FormData', formSchema);

// Nodemailer transporter setup (using Gmail as an example)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'bansaltanish12@gmail.com', // Replace with your Gmail email address
        pass: 'svhwlayyhpcdjbub', // Replace with your Gmail app-specific password
    },
});

// Handle form submission
app.post('/submit', (req, res) => {
    const { fullName, email, phone, gender, street, city, state, zipCode } = req.body;

    // Validation
    let errors = [];

    if (!fullName || fullName.length > 50) errors.push("Full Name is required and should be less than 50 characters.");
    if (!email || !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) errors.push("Invalid email format.");
    if (!phone || !/^\d{10}$/.test(phone)) errors.push("Phone Number must be 10 digits.");
    if (!gender) errors.push("Gender is required.");
    if (!street) errors.push("Street Address is required.");
    if (!city) errors.push("City is required.");
    if (!state) errors.push("State is required.");
    if (!zipCode || !/^\d{6}$/.test(zipCode)) errors.push("Zip Code must be 6 digits.");

    if (errors.length > 0) {
        return res.status(400).json({ message: errors.join(', ') });
    }

    // Save data to MongoDB
    const newFormData = new FormData({
        fullName,
        email,
        phone,
        gender,
        street,
        city,
        state,
        zipCode
    });

    newFormData.save()
        .then(() => {
            // Send email after saving to MongoDB
            const mailOptions = {
                from: 'bansaltanish12@gmail.com',
                to: 'tanishbansal1902@gmail.com',
                subject: 'New Registration Form Submission',
                html: `
                    <h2>New Registration Details</h2>
                    <p><strong>Full Name:</strong> ${fullName}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone Number:</strong> ${phone}</p>
                    <p><strong>Gender:</strong> ${gender}</p>
                    <p><strong>Street Address:</strong> ${street}</p>
                    <p><strong>City:</strong> ${city}</p>
                    <p><strong>State:</strong> ${state}</p>
                    <p><strong>Zip Code:</strong> ${zipCode}</p>
                `,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: 'Error occurred while sending email.' });
                }
                console.log('Email sent: ' + info.response);
                res.status(200).json({ message: 'Form submitted successfully!' });
            });
        })
        .catch(err => {
            console.log('Error saving to MongoDB:', err);
            res.status(500).json({ message: 'Error occurred while saving data.' });
        });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
