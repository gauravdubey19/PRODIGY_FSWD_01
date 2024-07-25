import express from "express";
import cors from "cors";
// import session from "express-session";
// import MongoStore from "connect-mongo";
import { connect } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import { protect, admin } from "./middleware/authMiddleware.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MongoDBUrl = process.env.MONGODB_URL || "";

// Middleware
app.use(cors());
app.use(express.json());

// Session management
// app.use(
//   session({
//     secret: "prodigy_auth",
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({
//       mongoUrl: MongoDBUrl,
//       collectionName: "sessions",
//     }),
//     cookie: { maxAge: 180 * 60 * 1000 }, // 3 hours
//   })
// );

// MongoDB connection
const connectDB = () => {
  connect(MongoDBUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log("\n✅ MongoDB connected."))
    .catch((err) => console.log("💥", err));
};

connectDB();

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const hashPswd = await bcrypt.hash(password, 5);

    const user = new User({ username, email, password: hashPswd });
    await user.save();

    res.status(200).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ message: "Invalid credentials or User is not registered!" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      "prodigy-jwt-secret",
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

app.get("/profile", protect, getProfile);

// Example of an admin-protected route
app.get("/admin", protect, admin, (req, res) => res.send("Admin route"));

app.listen(PORT, () => console.log(`\n✔ Server running on port ${PORT}...`));
