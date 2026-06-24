// test-server.js in ROOT folder
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Simple CORS
// Replace lines 9-14 in test-server.js with:
app.use(cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost', 'http://127.0.0.1', 'null'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// app.use(cors({
//     origin: '*',
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));
// app.use(express.json());

// Test MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/fakeProductDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ MongoDB Error:", err.message));

// SIMPLE TEST ROUTE - NO OTHER IMPORTS
app.post('/api/users/register', (req, res) => {
    console.log('📝 Signup request:', req.body);
    console.log('✅ Sending success response');
    
    res.json({ 
        success: true, 
        message: 'Registration successful!',
        user: {
            name: req.body.name,
            email: req.body.email,
            role: req.body.role,
            id: 'test-' + Date.now()
        }
    });
});

app.get('/', (req, res) => {
    res.json({ 
        message: 'Test server running',
        time: new Date().toISOString()
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✅ Test server running on http://localhost:${PORT}`);
    console.log(`📝 Test signup at: POST http://localhost:${PORT}/api/users/register`);
});