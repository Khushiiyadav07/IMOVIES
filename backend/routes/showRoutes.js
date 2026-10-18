const express = require("express");
const router = express.Router();
const Show = require("../models/showModel");
const Movie = require("../models/movieModel");
const Theatre = require("../models/theatreModel");

/**
 * @route   GET /api/shows or /api/shows/all
 * @desc    Get all scheduled shows
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    const shows = await Show.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: shows.length, shows });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch shows", error: error.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    const shows = await Show.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: shows.length, shows });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch shows" });
  }
});

/**
 * @route   GET /api/shows/movie/:movieId
 * @desc    Get all shows for a specific movie
 * @access  Public
 */
router.get("/movie/:movieId", async (req, res) => {
  try {
    const { movieId } = req.params;
    const shows = await Show.find({
      $or: [{ movieId }, { movieTitle: new RegExp(`^${movieId}$`, "i") }]
    });
    return res.status(200).json({ success: true, count: shows.length, shows });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

/**
 * @route   GET /api/shows/:id
 * @desc    Get show by ID (including booked seats status for seat selection)
 * @access  Public
 */
router.get("/:id", async (req, res) => {
  try {
    const show = await Show.findById(req.params.id);
    if (!show) {
      return res.status(404).json({ success: false, message: "Show not found" });
    }
    return res.status(200).json({ success: true, show });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Invalid show ID" });
  }
});

/**
 * @route   POST /api/shows or /api/shows/add
 * @desc    Schedule a new show (Add Show form)
 * @access  Admin
 */
const handleAddShow = async (req, res) => {
  try {
    const { movieId, theatreId, showDate, showTime, movieTitle, theatreName } = req.body;

    if ((!movieId && !movieTitle) || (!theatreId && !theatreName) || !showDate || !showTime) {
      return res.status(400).json({
        success: false,
        message: "Please select Theatre, Movie, Show Date, and Showtime."
      });
    }

    // Resolve Movie Title if not provided
    let resolvedMovieTitle = movieTitle;
    if (!resolvedMovieTitle && movieId) {
      const movie = await Movie.findById(movieId);
      if (movie) resolvedMovieTitle = movie.title;
    }

    // Resolve Theatre Name if not provided
    let resolvedTheatreName = theatreName;
    if (!resolvedTheatreName && theatreId) {
      const theatre = await Theatre.findById(theatreId);
      if (theatre) resolvedTheatreName = theatre.name;
    }

    const show = new Show({
      movieId,
      movieTitle: resolvedMovieTitle || "Movie",
      theatreId,
      theatreName: resolvedTheatreName || "Theatre",
      showDate,
      showTime,
      bookedSeats: []
    });

    await show.save();

    return res.status(201).json({
      success: true,
      message: "Show scheduled successfully",
      show
    });
  } catch (error) {
    console.error("Error creating show:", error);
    return res.status(500).json({ success: false, message: "Failed to schedule show", error: error.message });
  }
};

router.post("/", handleAddShow);
router.post("/add", handleAddShow);

/**
 * @route   DELETE /api/shows/:id or /api/shows/delete/:id
 * @desc    Delete a scheduled show (Admin Shows trash button)
 * @access  Admin
 */
const handleDeleteShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndDelete(req.params.id);
    if (!show) {
      return res.status(404).json({ success: false, message: "Show not found" });
    }
    return res.status(200).json({ success: true, message: "Show deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete show" });
  }
};

router.delete("/:id", handleDeleteShow);
router.delete("/delete/:id", handleDeleteShow);

module.exports = router;

