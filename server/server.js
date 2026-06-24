// // // // // server/server.js
// // // // const express = require('express');
// // // // const mongoose = require('mongoose');
// // // // const cors = require('cors');
// // // // require('dotenv').config();

// // // // // Initialize appS
// // // // const app = express();

// // // // // Middleware - FIX CORS to allow all origins (for development)
// // // // // Middleware - FIX CORS to allow all origins (for development)

// // // // app.use(cors({
// // // //     origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost', 'http://127.0.0.1', 'http://localhost:5000'],
// // // //     credentials: true,
// // // //     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
// // // //     allowedHeaders: ['Content-Type', 'Authorization']
// // // // }));
// // // // app.options('*', cors());
// // // // // app.use(cors({
// // // // //     origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost', 'http://127.0.0.1'],
// // // // //     credentials: true,
// // // // //     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
// // // // //     allowedHeaders: ['Content-Type', 'Authorization']
// // // // // }));
// // // // app.options('*', cors());
// // // // app.use(express.json());

// // // // // Import routes
// // // // const consumerRoutes = require('./routes/consumer');
// // // // const productRoutes = require('./routes/product');
// // // // const sellerRoutes = require('./routes/seller');
// // // // const userRoutes = require('./routes/user');

// // // // // Connect to MongoDB
// // // // const connectDB = async () => {
// // // //   try {
// // // //     await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/fakeProductDB", {
// // // //       useNewUrlParser: true,
// // // //       useUnifiedTopology: true,
// // // //     });
// // // //     console.log("✅ MongoDB Connected...");
    
// // // //     // Log database info
// // // //     console.log(`📊 Database: ${mongoose.connection.name}`);
// // // //     console.log(`🔗 Host: ${mongoose.connection.host}`);
// // // //     console.log(`🚪 Port: ${mongoose.connection.port}`);
    
// // // //   } catch (err) {
// // // //     console.error("❌ MongoDB Connection Error:", err.message);
// // // //     process.exit(1);
// // // //   }
// // // // };

// // // // connectDB();

// // // // // Routes
// // // // app.use('/api/consumers', consumerRoutes);
// // // // app.use('/api/products', productRoutes);
// // // // app.use('/api/sellers', sellerRoutes);
// // // // app.use('/api/users', userRoutes);

// // // // // Test route with better response
// // // // app.get('/', (req, res) => {
// // // //   res.json({ 
// // // //     message: 'API is running...',
// // // //     endpoints: {
// // // //       userRegister: 'POST /api/users/register',
// // // //       userLogin: 'POST /api/users/login',
// // // //       database: mongoose.connection.name || 'Connecting...'
// // // //     }
// // // //   });
// // // // });

// // // // // Error handling middleware
// // // // app.use((err, req, res, next) => {
// // // //   console.error(err.stack);
// // // //   res.status(500).json({ error: 'Something went wrong!' });
// // // // });

// // // // const PORT = process.env.PORT || 5000;

// // // // app.listen(PORT, () => {
// // // //   console.log(`🚀 Server running on port ${PORT}`);
// // // //   console.log(`🌐 API available at http://localhost:${PORT}`);
// // // // });

// // // // server/server.js - FIXED VERSION
// // // const express = require('express');
// // // const mongoose = require('mongoose');
// // // const cors = require('cors');
// // // require('dotenv').config();

// // // // Initialize app
// // // const app = express();

// // // // ===== FIX 1: CORS Configuration =====
// // // app.use(cors({
// // //     origin: '*', // Allow all origins for now (change in production)
// // //     credentials: true,
// // //     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
// // //     allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
// // // }));

// // // app.options('*', cors()); // Handle preflight requests

// // // // ===== FIX 2: Better Body Parsing =====
// // // app.use(express.json({ limit: '10mb' }));
// // // app.use(express.urlencoded({ extended: true }));

// // // // Import routes
// // // const consumerRoutes = require('./routes/consumer');
// // // const productRoutes = require('./routes/product');
// // // const sellerRoutes = require('./routes/seller');
// // // const userRoutes = require('./routes/user');

// // // // Connect to MongoDB
// // // const connectDB = async () => {
// // //   try {
// // //     const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/fakeProductDB";
// // //     console.log(`🔗 Connecting to MongoDB: ${mongoURI}`);
    
// // //     await mongoose.connect(mongoURI, {
// // //       useNewUrlParser: true,
// // //       useUnifiedTopology: true,
// // //       serverSelectionTimeoutMS: 5000, // Timeout after 5s
// // //       socketTimeoutMS: 45000, // Close sockets after 45s
// // //     });
    
// // //     console.log("✅ MongoDB Connected Successfully!");
// // //     console.log(`📊 Database: ${mongoose.connection.name}`);
// // //     console.log(`🔗 Host: ${mongoose.connection.host}`);
// // //     console.log(`🚪 Port: ${mongoose.connection.port}`);
    
// // //     // Test connection with a ping
// // //     await mongoose.connection.db.admin().ping();
// // //     console.log("🏓 MongoDB Ping Successful!");
    
// // //   } catch (err) {
// // //     console.error("❌ MongoDB Connection Error:", err.message);
// // //     console.error("Full error:", err);
// // //     process.exit(1);
// // //   }
// // // };

// // // connectDB();

// // // // ===== FIX 3: Route Registration with Logging =====
// // // app.use((req, res, next) => {
// // //   console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
// // //   next();
// // // });

// // // app.use('/api/consumers', consumerRoutes);
// // // app.use('/api/products', productRoutes);
// // // app.use('/api/sellers', sellerRoutes);
// // // app.use('/api/users', userRoutes);

// // // // ===== FIX 4: Health Check Endpoint =====
// // // app.get('/api/health', (req, res) => {
// // //   res.status(200).json({
// // //     status: 'OK',
// // //     timestamp: new Date().toISOString(),
// // //     database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
// // //     uptime: process.uptime()
// // //   });
// // // });

// // // // Root endpoint
// // // app.get('/', (req, res) => {
// // //   res.json({ 
// // //     message: 'FraudBlock API is running!',
// // //     endpoints: {
// // //       userRegister: 'POST /api/users/register',
// // //       userLogin: 'POST /api/users/login',
// // //       healthCheck: 'GET /api/health',
// // //       database: mongoose.connection.name || 'Connecting...'
// // //     },
// // //     docs: 'Check /api-docs for API documentation'
// // //   });
// // // });

// // // // ===== FIX 5: 404 Handler =====
// // // app.use('*', (req, res) => {
// // //   res.status(404).json({
// // //     success: false,
// // //     error: `Route ${req.originalUrl} not found`
// // //   });
// // // });

// // // // ===== FIX 6: Error Handling Middleware =====
// // // app.use((err, req, res, next) => {
// // //   console.error('❌ Server Error:', err.stack);
// // //   res.status(err.status || 500).json({
// // //     success: false,
// // //     error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!',
// // //     stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
// // //   });
// // // });

// // // const PORT = process.env.PORT || 5000;
// // // const HOST = process.env.HOST || '0.0.0.0';

// // // const server = app.listen(PORT, HOST, () => {
// // //   console.log('\n========================================');
// // //   console.log(`🚀 Server running on port ${PORT}`);
// // //   console.log(`🌐 Local: http://localhost:${PORT}`);
// // //   console.log(`🌐 Network: http://${HOST}:${PORT}`);
// // //   console.log('========================================\n');
  
// // //   // Log all available endpoints
// // //   console.log('📋 Available Endpoints:');
// // //   console.log('   POST /api/users/register  - Register new user');
// // //   console.log('   POST /api/users/login     - User login');
// // //   console.log('   GET  /api/health          - Health check');
// // //   console.log('   GET  /                    - API info');
// // //   console.log('========================================\n');
// // // });

// // // // Handle server errors
// // // server.on('error', (error) => {
// // //   if (error.code === 'EADDRINUSE') {
// // //     console.error(`❌ Port ${PORT} is already in use. Try a different port:`);
// // //     console.error(`   node server.js --port ${parseInt(PORT) + 1}`);
// // //     process.exit(1);
// // //   } else {
// // //     console.error('❌ Server error:', error);
// // //   }
// // // });

// // // // Graceful shutdown
// // // process.on('SIGINT', () => {
// // //   console.log('\n👋 Shutting down gracefully...');
// // //   mongoose.connection.close();
// // //   server.close(() => {
// // //     console.log('✅ Server closed');
// // //     process.exit(0);
// // //   });
// // // });

// // // server.js
// // const express = require('express');
// // const mongoose = require('mongoose');
// // const cors = require('cors');
// // const bcrypt = require('bcryptjs');
// // require('dotenv').config();

// // const app = express();

// // // Middleware
// // app.use(cors({
// //     origin: '*',
// //     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
// //     allowedHeaders: ['Content-Type', 'Authorization']
// // }));
// // app.use(express.json());

// // // User Schema
// // const userSchema = new mongoose.Schema({
// //     name: { type: String, required: true },
// //     email: { type: String, required: true, unique: true },
// //     password: { type: String, required: true },
// //     role: { type: String, enum: ['manufacturer', 'seller', 'consumer'], required: true },
// //     roleData: { type: Object, default: {} },
// //     walletAddress: { type: String, default: '' },
// //     createdAt: { type: Date, default: Date.now }
// // });

// // const User = mongoose.model('User', userSchema);

// // // Routes
// // app.get('/', (req, res) => {
// //     res.json({
// //         message: '✅ FraudBlock API is running!',
// //         endpoints: {
// //             register: 'POST /api/register',
// //             login: 'POST /api/login',
// //             health: 'GET /api/health',
// //             users: 'GET /api/users'
// //         },
// //         database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
// //     });
// // });

// // app.get('/api/health', (req, res) => {
// //     res.json({
// //         status: 'OK',
// //         database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
// //         timestamp: new Date().toISOString()
// //     });
// // });

// // // Register
// // app.post('/api/register', async (req, res) => {
// //     console.log('📝 Register request:', req.body.email);
    
// //     try {
// //         const { name, email, password, role } = req.body;
        
// //         if (!name || !email || !password || !role) {
// //             return res.status(400).json({
// //                 success: false,
// //                 error: 'All fields are required'
// //             });
// //         }
        
// //         // Check if user exists
// //         const existingUser = await User.findOne({ email });
// //         if (existingUser) {
// //             return res.status(400).json({
// //                 success: false,
// //                 error: 'Email already registered'
// //             });
// //         }
        
// //         // Hash password
// //         const hashedPassword = await bcrypt.hash(password, 10);
        
// //         // Create user
// //         const user = new User({
// //             name,
// //             email,
// //             password: hashedPassword,
// //             role,
// //             roleData: {}
// //         });
        
// //         await user.save();
// //         console.log(`✅ User registered: ${email}`);
        
// //         // Return user without password
// //         const userResponse = user.toObject();
// //         delete userResponse.password;
        
// //         res.status(201).json({
// //             success: true,
// //             message: 'Registration successful!',
// //             user: userResponse
// //         });
        
// //     } catch (error) {
// //         console.error('❌ Registration error:', error);
// //         res.status(500).json({
// //             success: false,
// //             error: error.message
// //         });
// //     }
// // });

// // // Login
// // app.post('/api/login', async (req, res) => {
// //     console.log('🔑 Login request:', req.body.email);
    
// //     try {
// //         const { email, password } = req.body;
        
// //         if (!email || !password) {
// //             return res.status(400).json({
// //                 success: false,
// //                 error: 'Email and password required'
// //             });
// //         }
        
// //         // Find user
// //         const user = await User.findOne({ email });
// //         if (!user) {
// //             return res.status(401).json({
// //                 success: false,
// //                 error: 'Invalid credentials'
// //             });
// //         }
        
// //         // Verify password
// //         const isPasswordValid = await bcrypt.compare(password, user.password);
// //         if (!isPasswordValid) {
// //             return res.status(401).json({
// //                 success: false,
// //                 error: 'Invalid credentials'
// //             });
// //         }
        
// //         // Return user without password
// //         const userResponse = user.toObject();
// //         delete userResponse.password;
        
// //         res.json({
// //             success: true,
// //             message: 'Login successful',
// //             user: userResponse
// //         });
        
// //     } catch (error) {
// //         console.error('❌ Login error:', error);
// //         res.status(500).json({
// //             success: false,
// //             error: 'Server error'
// //         });
// //     }
// // });

// // // Get all users (for debugging)
// // app.get('/api/users', async (req, res) => {
// //     try {
// //         const users = await User.find({}, '-password');
// //         res.json({
// //             success: true,
// //             count: users.length,
// //             users: users
// //         });
// //     } catch (error) {
// //         res.status(500).json({ error: error.message });
// //     }
// // });

// // // Connect to MongoDB
// // const connectDB = async () => {
// //     try {
// //         console.log('🔗 Connecting to MongoDB...');
        
// //         // Use localhost connection string
// //         const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fraudBlockDB';
        
// //         await mongoose.connect(mongoURI, {
// //             useNewUrlParser: true,
// //             useUnifiedTopology: true,
// //         });
        
// //         console.log('✅ MongoDB Connected Successfully!');
// //         console.log(`📊 Database: ${mongoose.connection.name}`);
// //         console.log(`🔗 URI: ${mongoURI}`);
        
// //     } catch (error) {
// //         console.error('❌ MongoDB Connection Error:', error.message);
// //         console.log('\n💡 Troubleshooting tips:');
// //         console.log('1. Make sure MongoDB service is running');
// //         console.log('2. Try: mongodb://localhost:27017');
// //         console.log('3. Check connection in MongoDB Compass');
// //         process.exit(1);
// //     }
// // };

// // // Start server
// // const startServer = async () => {
// //     await connectDB();
    
// //     const PORT = process.env.PORT || 5000;
// //     app.listen(PORT, () => {
// //         console.log('\n========================================');
// //         console.log(`🚀 Server running on port ${PORT}`);
// //         console.log(`🌐 http://localhost:${PORT}`);
// //         console.log('========================================\n');
// //         console.log('📋 Test endpoints:');
// //         console.log(`1. http://localhost:${PORT}`);
// //         console.log(`2. http://localhost:${PORT}/api/health`);
// //         console.log('3. Open signup.html to register');
// //         console.log('========================================\n');
// //     });
// // };

// // startServer();

// // server.js (FINAL – MongoDB + Signup + Login)

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const bcrypt = require('bcryptjs');
// require('dotenv').config();

// const app = express();

// // ================= MIDDLEWARE =================
// app.use(cors({ origin: '*'}));
// app.use(express.json());

// // ================= USER SCHEMA =================
// const userSchema = new mongoose.Schema({
//     name: String,
//     email: { type: String, unique: true },
//     password: String,
//     role: { type: String, enum: ['manufacturer', 'seller', 'consumer'] },
//     walletAddress: { type: String, default: '' },
//     createdAt: { type: Date, default: Date.now }
// });

// const User = mongoose.model('User', userSchema);

// // ================= HEALTH =================
// app.get('/api/health', (req, res) => {
//     res.json({
//         status: 'OK',
//         database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
//     });
// });

// // ================= REGISTER =================
// app.post('/api/register', async (req, res) => {
//     try {
//         const { name, email, password, role } = req.body;

//         if (!name || !email || !password || !role) {
//             return res.status(400).json({ error: 'All fields required' });
//         }

//         const existing = await User.findOne({ email });
//         if (existing) {
//             return res.status(400).json({ error: 'Email already exists' });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const user = await User.create({
//             name,
//             email,
//             password: hashedPassword,
//             role
//         });

//         const responseUser = user.toObject();
//         delete responseUser.password;

//         res.status(201).json({
//             success: true,
//             user: responseUser
//         });

//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // ================= LOGIN =================
// app.post('/api/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         const user = await User.findOne({ email });
//         if (!user) return res.status(401).json({ error: 'Invalid credentials' });

//         const match = await bcrypt.compare(password, user.password);
//         if (!match) return res.status(401).json({ error: 'Invalid credentials' });

//         const responseUser = user.toObject();
//         delete responseUser.password;

//         res.json({ success: true, user: responseUser });

//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // ================= DEBUG =================
// app.get('/api/users', async (req, res) => {
//     const users = await User.find({}, '-password');
//     res.json(users);
// });

// // ================= START =================
// const start = async () => {
//     await mongoose.connect('mongodb://127.0.0.1:27017/fraudBlockDB');
//     console.log('✅ MongoDB Connected');

//     app.listen(5000, () => {
//         console.log('🚀 Server running on http://localhost:5000');
//     });
// };

// start();
