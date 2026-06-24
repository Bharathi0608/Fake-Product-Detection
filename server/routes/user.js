// // routes/user.js
// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');

// // Register new user
// router.post('/register', async (req, res) => {
//   console.log('=== SIGNUP REQUEST RECEIVED ===');
//   console.log('Headers:', req.headers);
//   console.log('Body:', req.body);
//   console.log('Time:', new Date().toISOString());
//   console.log('==============================');
  
//   try {
//     const { name, email, password, role, roleData } = req.body;
    
//     // Debug: Check if body is received
//     console.log('Parsed data:', { name, email, password, role, roleData });
    
//     // Validate required fields
//     if (!name || !email || !password || !role) {
//       console.log('❌ Missing required fields');
//       console.log('Missing:', { 
//         name: !name, 
//         email: !email, 
//         password: !password, 
//         role: !role 
//       });
      
//       return res.status(400).json({ 
//         success: false,
//         error: 'All fields are required: name, email, password, role' 
//       });
//     }
    
//     // Check if user already exists
//     console.log(`🔍 Checking if user exists: ${email}`);
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       console.log(`❌ User already exists: ${email}`);
//       return res.status(400).json({ 
//         success: false,
//         error: 'Email already registered' 
//       });
//     }
    
//     // Create new user
//     console.log(`📝 Creating new user: ${email}`);
//     const user = new User({
//       name,
//       email,
//       password, // Note: In production, you should hash the password!
//       role,
//       roleData: roleData || {}
//     });
    
//     await user.save();
//     console.log(`✅ User saved to MongoDB with ID: ${user._id}`);
    
//     // Don't send password back in response
//     const userResponse = user.toObject();
//     delete userResponse.password;
    
//     console.log('📤 Sending response:', { 
//       message: 'Registration successful!',
//       userId: userResponse._id,
//       email: userResponse.email,
//       role: userResponse.role 
//     });
    
//     res.status(201).json({ 
//       success: true,
//       message: 'Registration successful!', 
//       user: userResponse 
//     });
    
//   } catch (error) {
//     console.error('❌ ERROR registering user:');
//     console.error('Error name:', error.name);
//     console.error('Error message:', error.message);
//     console.error('Error code:', error.code);
//     console.error('Full error:', error);
    
//     // Handle duplicate key error (unique email)
//     if (error.code === 11000) {
//       return res.status(400).json({ 
//         success: false,
//         error: 'Email already registered' 
//       });
//     }
    
//     // Handle validation errors
//     if (error.name === 'ValidationError') {
//       const errors = Object.values(error.errors).map(err => err.message);
//       return res.status(400).json({ 
//         success: false,
//         error: `Validation error: ${errors.join(', ')}` 
//       });
//     }
    
//     res.status(500).json({ 
//       success: false,
//       error: 'Server error during registration' 
//     });
//   }
// });

// // Get user by email (for login)
// router.post('/login', async (req, res) => {
//   console.log('=== LOGIN REQUEST ===');
//   console.log('Body:', req.body);
  
//   try {
//     const { email, password } = req.body;
    
//     if (!email || !password) {
//       return res.status(400).json({ 
//         success: false,
//         error: 'Email and password are required' 
//       });
//     }
    
//     console.log(`🔍 Looking for user: ${email}`);
//     const user = await User.findOne({ email });
//     if (!user) {
//       console.log(`❌ User not found: ${email}`);
//       return res.status(404).json({ 
//         success: false,
//         error: 'User not found' 
//       });
//     }
    
//     console.log(`🔑 Verifying password for: ${email}`);
//     // In production, you should compare hashed passwords
//     if (user.password !== password) {
//       console.log(`❌ Invalid password for: ${email}`);
//       return res.status(401).json({ 
//         success: false,
//         error: 'Invalid credentials' 
//       });
//     }
    
//     // Don't send password back in response
//     const userResponse = user.toObject();
//     delete userResponse.password;
    
//     console.log(`✅ Login successful for: ${email}`);
    
//     res.json({ 
//       success: true,
//       message: 'Login successful', 
//       user: userResponse 
//     });
//   } catch (error) {
//     console.error('❌ Error logging in:', error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Server error during login' 
//     });
//   }
// });

// // Debug endpoint: Get all users (for testing)
// router.get('/debug/all', async (req, res) => {
//   try {
//     const users = await User.find({}, '-password');
//     console.log(`📊 Total users in database: ${users.length}`);
    
//     res.json({
//       success: true,
//       count: users.length,
//       users: users
//     });
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // Debug endpoint: Get user count
// router.get('/debug/count', async (req, res) => {
//   try {
//     const count = await User.countDocuments();
//     console.log(`📊 User count: ${count}`);
    
//     res.json({
//       success: true,
//       count: count
//     });
//   } catch (error) {
//     console.error('Error counting users:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;

// routes/user.js - UPDATED WITH PASSWORD HASHING
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const saltRounds = 10; // For password hashing

// Register new user
router.post('/register', async (req, res) => {
  console.log('\n=== SIGNUP REQUEST RECEIVED ===');
  console.log('Time:', new Date().toISOString());
  console.log('Body:', JSON.stringify(req.body, null, 2));
  console.log('==============================');
  
  try {
    const { name, email, password, role, roleData } = req.body;
    
    // Validate required fields
    if (!name || !email || !password || !role) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ 
        success: false,
        error: 'All fields are required: name, email, password, role' 
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        error: 'Please enter a valid email address' 
      });
    }
    
    // Check if user already exists
    console.log(`🔍 Checking if user exists: ${email}`);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`❌ User already exists: ${email}`);
      return res.status(409).json({ 
        success: false,
        error: 'Email already registered' 
      });
    }
    
    // ===== FIX: Hash Password =====
    console.log(`🔒 Hashing password for: ${email}`);
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create new user with hashed password
    console.log(`📝 Creating new user: ${email}`);
    const user = new User({
      name,
      email,
      password: hashedPassword, // Store hashed password
      role,
      roleData: roleData || {},
      walletAddress: '' // Initialize empty
    });
    
    await user.save();
    console.log(`✅ User saved to MongoDB with ID: ${user._id}`);
    
    // Don't send password back in response
    const userResponse = user.toObject();
    delete userResponse.password;
    
    console.log('📤 Registration successful!');
    
    res.status(201).json({ 
      success: true,
      message: 'Registration successful!', 
      user: userResponse 
    });
    
  } catch (error) {
    console.error('❌ ERROR registering user:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({ 
        success: false,
        error: 'Email already registered' 
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false,
        error: `Validation error: ${errors.join(', ')}` 
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Server error during registration' 
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  console.log('\n=== LOGIN REQUEST ===');
  console.log('Time:', new Date().toISOString());
  console.log('Email:', req.body.email);
  
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Email and password are required' 
      });
    }
    
    console.log(`🔍 Looking for user: ${email}`);
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`❌ User not found: ${email}`);
      return res.status(404).json({ 
        success: false,
        error: 'Invalid credentials' // Don't say "user not found" for security
      });
    }
    
    console.log(`🔑 User found, verifying password...`);
    
    // ===== FIX: Compare hashed password =====
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log(`❌ Invalid password for: ${email}`);
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }
    
    // Don't send password back in response
    const userResponse = user.toObject();
    delete userResponse.password;
    
    console.log(`✅ Login successful for: ${email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Name: ${user.name}`);
    
    res.json({ 
      success: true,
      message: 'Login successful', 
      user: userResponse 
    });
  } catch (error) {
    console.error('❌ Error logging in:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error during login' 
    });
  }
});

// Debug endpoint: Get all users (for testing)
router.get('/debug/all', async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    console.log(`📊 Total users in database: ${users.length}`);
    
    res.json({
      success: true,
      count: users.length,
      users: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: error.message });
  }
});

// Debug endpoint: Get user count
router.get('/debug/count', async (req, res) => {
  try {
    const count = await User.countDocuments();
    console.log(`📊 User count: ${count}`);
    
    res.json({
      success: true,
      count: count
    });
  } catch (error) {
    console.error('Error counting users:', error);
    res.status(500).json({ error: error.message });
  }
});

// Check if email exists
router.get('/check-email/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    
    res.json({
      exists: !!user
    });
  } catch (error) {
    console.error('Error checking email:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;