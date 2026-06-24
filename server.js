// // server.js — FIXED VERSION (WORKS WITH YOUR signup.html)
// const path = require("path");
// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();
// const PORT = 5000;

// // ================= MIDDLEWARE =================
// // 

// app.use(express.json());

// // ================= IN-MEMORY DATABASE =================
// // (No MongoDB needed for now)
// let users = [];
// let nextUserId = 1;

// // ================= HEALTH CHECK =================
// app.get("/api/health", (req, res) => {
//   res.json({
//     success: true,
//     message: "Server is running",
//     timestamp: new Date().toISOString()
//   });
// });

// // ================= REGISTER =================
// app.post("/api/register", (req, res) => {
//   const { name, email, password, role } = req.body;

//   // Validation
//   if (!name || !email || !password || !role) {
//     return res.status(400).json({
//       success: false,
//       error: "All fields are required"
//     });
//   }

//   // Check existing user
//   const existingUser = users.find(
//     u => u.email.toLowerCase() === email.toLowerCase()
//   );

//   if (existingUser) {
//     return res.status(409).json({
//       success: false,
//       error: "Email already registered"
//     });
//   }

//   // Create user
//   const newUser = {
//     id: nextUserId++,
//     name: name.trim(),
//     email: email.toLowerCase().trim(),
//     password: password, // plain text for now (OK for testing)
//     role,
//     createdAt: new Date()
//   };

//   users.push(newUser);

//   // Remove password before sending response
//   const { password: _, ...safeUser } = newUser;

//   res.status(201).json({
//     success: true,
//     message: "Registration successful!",
//     user: safeUser
//   });
// });

// // ================= LOGIN =================
// app.post("/api/login", (req, res) => {
//   const { email, password } = req.body;

//   const user = users.find(
//     u => u.email === email.toLowerCase()
//   );

//   if (!user || user.password !== password) {
//     return res.status(401).json({
//       success: false,
//       error: "Invalid credentials"
//     });
//   }

//   const { password: _, ...safeUser } = user;

//   res.json({
//     success: true,
//     message: "Login successful!",
//     user: safeUser
//   });
// });

// // ❌ IMPORTANT: NO app.use('*') — this caused your crash

// // ================= START SERVER =================
// app.listen(PORT, () => {
//   console.log("=======================================");
//   console.log("🚀 Backend server running successfully");
//   console.log("📡 URL: http://localhost:5000");
//   console.log("🌐 Health: http://localhost:5000/api/health");
//   console.log("=======================================");
// });


// server.js — UPDATED VERSION (SERVES FRONTEND + API)

const path = require("path");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/fraudBlockDB")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));
  const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model("User", userSchema);

const app = express();
const PORT = 5000;

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ✅ SERVE STATIC FRONTEND FILES (src folder)
app.use(express.static(path.join(__dirname, "src")));
app.use('/build', express.static(path.join(__dirname, 'build')));

// ================= IN-MEMORY DATABASE =================
// let users = [];
// let nextUserId = 1;

// ================= HEALTH CHECK =================
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
});

// ================= REGISTER =================
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        error: "All fields are required"
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase()
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "Email already registered"
      });
    }

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role
    });

    const { password: _, ...safeUser } = newUser.toObject();

    res.status(201).json({
      success: true,
      message: "Registration successful!",
      user: safeUser
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
});

// ================= LOGIN =================

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase()
    });

    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials"
      });
    }

    const { password: _, ...safeUser } = user.toObject();

    res.json({
      success: true,
      message: "Login successful!",
      user: safeUser
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
});

// ✅ ROOT ROUTE (opens index.html automatically)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "index.html"));
});

// ================= START SERVER =================
const open = (...args) => import('open').then(mod => mod.default(...args));

app.listen(PORT, async () => {
  console.log("=======================================");
  console.log("🚀 Backend server running successfully");
  console.log("📡 URL: http://localhost:5000");
  console.log("🌐 Health: http://localhost:5000/api/health");
  console.log("=======================================");

  await open(`http://localhost:${PORT}`);
});