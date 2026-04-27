const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());


// ✅ CORS (FULL FIX)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});


// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/authDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));


// Schema
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String
});

const User = mongoose.model("User", userSchema);


// 🟢 SIGN UP
app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !email || !password) {
      return res.json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }

    const user = new User({ firstName, lastName, email, password });
    await user.save();

    res.json({ message: "Signup successful" });

  } catch (error) {
    console.log(error);
    res.json({ message: "Server error" });
  }
});


// 🟢 SIGN IN
app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.json({ message: "Wrong password" });
    }

    res.json({ message: "Login successful" });

  } catch (error) {
    console.log(error);
    res.json({ message: "Server error" });
  }
});


// Test Route
app.get("/", (req, res) => {
  res.send("Backend is working");
});


// Start Server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});