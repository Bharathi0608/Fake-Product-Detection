// // simple-server.js
// const express = require('express');
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const app = express();

// // Fix CORS errors
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     if (req.method === 'OPTIONS') {
//         return res.sendStatus(200);
//     }
//     next();
// });

// app.use(express.json());

// // Connect to MongoDB
// console.log('🔗 Connecting to MongoDB...');
// mongoose.connect('mongodb://127.0.0.1:27017/fraudBlockDB', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// .then(() => console.log('✅ MongoDB Connected!'))
// .catch(err => {
//     console.error('❌ MongoDB Error:', err.message);
//     console.log('💡 Make sure MongoDB is running (check MongoDB Compass)');
//     process.exit(1);
// });

// // User Model
// const User = mongoose.model('User', {
//     name: String,
//     email: { type: String, unique: true },
//     password: String,
//     role: String,
//     createdAt: { type: Date, default: Date.now }
// });

// // Routes
// app.get('/', (req, res) => {
//     res.json({ 
//         message: '✅ FraudBlock API is running!',
//         endpoints: {
//             register: 'POST /api/register',
//             login: 'POST /api/login',
//             health: 'GET /api/health'
//         }
//     });
// });

// app.get('/api/health', (req, res) => {
//     res.json({ 
//         status: 'OK',
//         database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
//         timestamp: new Date().toISOString()
//     });
// });

// // Register user
// app.post('/api/register', async (req, res) => {
//     console.log('\n📝 REGISTER REQUEST ================');
//     console.log('Email:', req.body.email);
//     console.log('Role:', req.body.role);
    
//     try {
//         const { name, email, password, role } = req.body;
        
//         // Validation
//         if (!name || !email || !password || !role) {
//             return res.status(400).json({ 
//                 success: false,
//                 error: 'All fields are required' 
//             });
//         }
        
//         // Check if user exists
//         const existingUser = await User.findOne({ email: email.toLowerCase() });
//         if (existingUser) {
//             return res.status(400).json({ 
//                 success: false,
//                 error: 'Email already registered' 
//             });
//         }
        
//         // Hash password
//         const hashedPassword = await bcrypt.hash(password, 10);
        
//         // Create user
//         const user = new User({
//             name: name.trim(),
//             email: email.toLowerCase().trim(),
//             password: hashedPassword,
//             role: role
//         });
        
//         await user.save();
//         console.log('✅ User saved to database!');
        
//         // Return response
//         res.json({
//             success: true,
//             message: 'Registration successful!',
//             user: {
//                 _id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 role: user.role
//             }
//         });
        
//     } catch (error) {
//         console.error('❌ Registration error:', error);
//         res.status(500).json({ 
//             success: false,
//             error: 'Server error: ' + error.message 
//         });
//     }
// });

// // Login user
// app.post('/api/login', async (req, res) => {
//     console.log('\n🔑 LOGIN REQUEST ================');
//     console.log('Email:', req.body.email);
    
//     try {
//         const { email, password } = req.body;
        
//         if (!email || !password) {
//             return res.status(400).json({ 
//                 success: false,
//                 error: 'Email and password required' 
//             });
//         }
        
//         // Find user
//         const user = await User.findOne({ email: email.toLowerCase() });
//         if (!user) {
//             return res.status(401).json({ 
//                 success: false,
//                 error: 'Invalid credentials' 
//             });
//         }
        
//         // Check password
//         const validPassword = await bcrypt.compare(password, user.password);
//         if (!validPassword) {
//             return res.status(401).json({ 
//                 success: false,
//                 error: 'Invalid credentials' 
//             });
//         }
        
//         console.log('✅ Login successful!');
        
//         res.json({
//             success: true,
//             message: 'Login successful!',
//             user: {
//                 _id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 role: user.role
//             }
//         });
        
//     } catch (error) {
//         console.error('❌ Login error:', error);
//         res.status(500).json({ 
//             success: false,
//             error: 'Server error' 
//         });
//     }
// });

// // Get all users (for debugging)
// app.get('/api/users', async (req, res) => {
//     try {
//         const users = await User.find({}, '-password');
//         res.json({
//             success: true,
//             count: users.length,
//             users: users
//         });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Start server
// const PORT = 5000;
// app.listen(PORT, () => {
//     console.log('\n' + '='.repeat(50));
//     console.log(`🚀 Server started on port ${PORT}`);
//     console.log(`🌐 http://localhost:${PORT}`);
//     console.log('='.repeat(50));
//     console.log('📋 Test these URLs:');
//     console.log(`1. http://localhost:${PORT}`);
//     console.log(`2. http://localhost:${PORT}/api/health`);
//     console.log(`3. Open signup.html in browser`);
//     console.log('='.repeat(50));
// });