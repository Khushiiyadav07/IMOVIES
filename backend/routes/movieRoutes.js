const express = require("express");
const router = express.Router();
const Movie = require("../models/movieModel");
const Show = require("../models/showModel");

/**
 * @route   GET /api/movie or /api/movie/all
 * @desc    Get all movies with optional search query & genre filter
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    const { search, genre } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { genres: { $regex: search, $options: "i" } }
      ];
    }

    if (genre && genre !== "All") {
      query.genres = { $regex: genre, $options: "i" };
    }

    const movies = await Movie.find(query).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: movies.length, movies });
  } catch (error) {
    console.error("Error fetching movies:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: movies.length, movies });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * @route   GET /api/movie/:id
 * @desc    Get movie details by ID
 * @access  Public
 */
router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }
    return res.status(200).json({ success: true, movie });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Invalid movie ID", error: error.message });
  }
});

/**
 * @route   POST /api/movie or /api/movie/add
 * @desc    Add a new movie (Admin Add Movie)
 * @access  Public / Admin
 */
const handleAddMovie = async (req, res) => {
  try {
    const {
      title,
      description,
      genres,
      runtime,
      trailerUrl,
      releaseDate,
      certification,
      poster,
      backdrop,
      rating
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Movie title and description are required."
      });
    }

    const movie = new Movie({
      title,
      description,
      genres: genres || "Action, Drama",
      runtime: runtime ? `${runtime}` : "150 min",
      trailerUrl: trailerUrl || "",
      releaseDate: releaseDate || "Coming Soon",
      certification: certification || "U/A",
      poster: poster || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60",
      backdrop: backdrop || poster || "",
      rating: rating || 4.5
    });

    await movie.save();

    return res.status(201).json({
      success: true,
      message: "Movie added successfully",
      movie
    });
  } catch (error) {
    console.error("Error adding movie:", error);
    return res.status(500).json({ success: false, message: "Failed to add movie", error: error.message });
  }
};

router.post("/", handleAddMovie);
router.post("/add", handleAddMovie);

/**
 * @route   PUT /api/movie/:id
 * @desc    Update an existing movie
 * @access  Admin
 */
router.put("/:id", async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!movie) {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }
    return res.status(200).json({ success: true, message: "Movie updated successfully", movie });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update movie", error: error.message });
  }
});

/**
 * @route   DELETE /api/movie/:id or /api/movie/delete/:id
 * @desc    Delete movie & its associated shows
 * @access  Admin
 */
const handleDeleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }

    // Also delete any shows scheduled for this movie
    await Show.deleteMany({
      $or: [{ movieId: req.params.id }, { movieTitle: movie.title }]
    });

    return res.status(200).json({
      success: true,
      message: "Movie and its associated shows deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete movie", error: error.message });
  }
};

router.delete("/:id", handleDeleteMovie);
router.delete("/delete/:id", handleDeleteMovie);

module.exports = router;

