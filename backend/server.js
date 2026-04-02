const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request Logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err.message);
        if (err.name === 'MongooseServerSelectionError') {
            console.error('Tip: Check if your current IP address is whitelisted in MongoDB Atlas: https://www.mongodb.com/docs/atlas/security-whitelist/');
        }
    });

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/events', require('./routes/events'));

app.get('/cron', (req, res) => {
    console.log(`[${new Date().toISOString()}] Cron job pulse received`);
    res.send('Cron executed');
});

app.get('/', (req, res) => {
    res.send('WhatsApp Sales API is running');
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('API Error:', err.message);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
