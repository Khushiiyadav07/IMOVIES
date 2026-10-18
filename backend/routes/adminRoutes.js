const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");
const Movie = require("../models/movieModel");
const Show = require("../models/showModel");
const Theatre = require("../models/theatreModel");
const Booking = require("../models/bookingModel");
const fetchUser = require("../middlewares/fetchUser");

const JWT_SECRET = process.env.JWT_SECRET || "imovies_super_secret_jwt_key_2026";
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || "admin123";

/**
 * @route   POST /api/auth/admin/register
 * @desc    Register a new administrator
 * @access  Protected with Admin Secret Key
 */
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, adminSecret } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, email, and password are required."
      });
    }

    if (adminSecret && adminSecret !== ADMIN_SECRET_KEY) {
      return res.status(403).json({
        success: false,
        message: "Invalid admin security key."
      });
    }

    let existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "An admin account with this email already exists."
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = new Admin({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "admin"
    });

    await admin.save();

    const payload = {
      user: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: "admin"
      }
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: "admin"
      }
    });
  } catch (error) {
    console.error("Error in admin register:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during admin registration",
      error: error.message
    });
  }
});

/**
 * @route   POST /api/auth/admin/login
 * @desc    Admin login
 * @access  Public
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter both email and password."
      });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "Invalid admin credentials."
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid admin credentials."
      });
    }

    const payload = {
      user: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: "admin"
      }
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    return res.status(200).json({
      success: true,
      message: "Admin authenticated successfully",
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: "admin"
      }
    });
  } catch (error) {
    console.error("Error in admin login:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during admin login",
      error: error.message
    });
  }
});

/**
 * @route   GET /api/auth/admin/me
 * @desc    Get current admin profile
 * @access  Private
 */
router.get("/me", fetchUser, async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password");
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }
    return res.status(200).json({ success: true, admin });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * @route   GET /api/auth/admin/stats
 * @desc    Get aggregate stats for Admin Dashboard
 * @access  Private
 */
router.get("/stats", fetchUser, async (req, res) => {
  try {
    const totalMovies = await Movie.countDocuments();
    const totalShows = await Show.countDocuments();
    const totalTheatres = await Theatre.countDocuments();
    const totalBookings = await Booking.countDocuments();

    const bookings = await Booking.find();
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    return res.status(200).json({
      success: true,
      stats: {
        totalMovies,
        totalShows,
        totalTheatres,
        totalBookings,
        totalRevenue
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch stats", error: error.message });
  }
});

module.exports = router;

