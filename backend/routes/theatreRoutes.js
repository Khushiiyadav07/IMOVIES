const express = require("express");
const router = express.Router();
const Theatre = require("../models/theatreModel");

/**
 * @route   GET /api/theatre or /api/theatre/all
 * @desc    Get all theatres
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    const theatres = await Theatre.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: theatres.length, theatres });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch theatres", error: error.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    const theatres = await Theatre.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: theatres.length, theatres });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch theatres" });
  }
});

/**
 * @route   GET /api/theatre/:id
 * @desc    Get single theatre by ID
 * @access  Public
 */
router.get("/:id", async (req, res) => {
  try {
    const theatre = await Theatre.findById(req.params.id);
    if (!theatre) {
      return res.status(404).json({ success: false, message: "Theatre not found" });
    }
    return res.status(200).json({ success: true, theatre });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Invalid theatre ID" });
  }
});

/**
 * @route   POST /api/theatre or /api/theatre/add
 * @desc    Create a new theatre with 3 seating tiers (Balcony, Middle, Lower)
 * @access  Admin
 */
const handleAddTheatre = async (req, res) => {
  try {
    const {
      name,
      location,
      balconyPrice,
      balconySeats,
      middlePrice,
      middleSeats,
      lowerPrice,
      lowerSeats
    } = req.body;

    if (!name || !location) {
      return res.status(400).json({
        success: false,
        message: "Theatre name and location are required."
      });
    }

    const theatre = new Theatre({
      name,
      location,
      balconyPrice: Number(balconyPrice) || 175,
      balconySeats: Number(balconySeats) || 50,
      middlePrice: Number(middlePrice) || 130,
      middleSeats: Number(middleSeats) || 120,
      lowerPrice: Number(lowerPrice) || 100,
      lowerSeats: Number(lowerSeats) || 80
    });

    await theatre.save();

    return res.status(201).json({
      success: true,
      message: "Theatre created successfully",
      theatre
    });
  } catch (error) {
    console.error("Error creating theatre:", error);
    return res.status(500).json({ success: false, message: "Failed to create theatre", error: error.message });
  }
};

router.post("/", handleAddTheatre);
router.post("/add", handleAddTheatre);

/**
 * @route   DELETE /api/theatre/:id
 * @desc    Delete theatre by ID
 * @access  Admin
 */
router.delete("/:id", async (req, res) => {
  try {
    const theatre = await Theatre.findByIdAndDelete(req.params.id);
    if (!theatre) {
      return res.status(404).json({ success: false, message: "Theatre not found" });
    }
    return res.status(200).json({ success: true, message: "Theatre deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete theatre" });
  }
});

module.exports = router;

