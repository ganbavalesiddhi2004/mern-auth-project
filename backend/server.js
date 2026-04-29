const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
mongoose.connect("mongodb://127.0.0.1:27017/authDB")
.then(() => {
  console.log("MongoDB Connected Successfully");
})
.catch((err) => {
  console.log("MongoDB Error:", err);
});
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});
const User = mongoose.model("User", userSchema);
app.post("/signup", async (req, res) => {

  try {

    console.log("Received Data:", req.body);

    const { firstName, lastName, email, password } = req.body;

    // Validation
    if (!firstName || !email || !password) {

      return res.status(400).json({
        success: false,
        message: "All required fields must be filled"
      });

    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {

      return res.status(400).json({
        success: false,
        message: "User already exists"
      });

    }
    const newUser = new User({
      firstName,
      lastName,
      email,
      password
    });
    await newUser.save();
    console.log("✅ User Saved Successfully");
    res.status(201).json({
      success: true,
      message: "Signup Successful",
      user: newUser
    });
  } catch (error) {
    console.log(" Signup Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

});
app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found"
      });

    }

    if (user.password !== password) {

      return res.status(400).json({
        success: false,
        message: "Wrong password"
      });

    }
    res.json({
      success: true,
      message: "Login Successful"
    });

  } catch (error) {

    console.log("Signin Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

});

app.get("/users", async (req, res) => {

  try {

    const users = await User.find();

    res.json({
      success: true,
      totalUsers: users.length,
      users
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Error fetching users"
    });

  }
});
app.get("/", (req, res) => {

  res.send(`
    <h2 style="font-family:Arial; color:green; text-align:center;">
       Backend Working Successfully
    </h2>
  `);

});
const PORT = 5000;
app.listen(PORT, () => {
   console.log(`Server running on http://localhost:${PORT}`);

});