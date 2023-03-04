const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const helmet = require('helmet');
const cors = require('cors');
require("dotenv").config();

const { PASSWORD: passwd, EMAIL } = process.env;

const app = express();


// Middlewares
app.use(bodyParser.urlencoded({
    extended: false
})); // Parse request bodies in URL-encoded format
app.use(bodyParser.json()); // Parse request bodies in JSON format
app.use(helmet());
app.use(cors());
app.use(express.static('public')); // Serve static files from the public folder

// Set access control headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // Remove X-Powered-By header
    res.removeHeader('X-Powered-By');

    // Remove any other headers that might be insecure
    res.removeHeader('X-Frame-Options');
    res.removeHeader('X-Content-Type-Options');
    res.removeHeader('X-Download-Options');
    res.removeHeader('Referrer-Policy');
    res.removeHeader('Feature-Policy');

    next();
});

// Routes
app.get('/', (req, res) => {
    // Serve index.html
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/contact', (req, res) => {
    const {
        name,
        email,
        message
    } = req.body;

    // Create a transport object for sending email
    const transporter = nodemailer.createTransport({
        host: 'smtp.protonmail.com',
        port: 465,
        secure: true,
        auth: {
            user: EMAIL,
            pass: passwd
        }
    });


    // Set up email message
    const mailOptions = {
        from: "evelynnection@proton.me",
        to: "evelynnection@proton.me",
        subject: 'New Contact Form Submission',
        text: `
      You have received a new contact form submission:

      Name: ${name}
      Email: ${email}
      Message: ${message}
    `
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent: ' + info.response);
            res.send('Contact form submitted successfully');
        }
    });
});

// Start server on *:80
app.listen(3000, () => {
    console.log('Server started on port 80');
});