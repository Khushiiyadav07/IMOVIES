const express = require("express");
const router = express.Router();
const Favorite = require("../models/favoriteModel");

/**
 * @route   GET /api/favorite or /api/favorite/all
 * @desc    Get user's favorites / watchlist
 * @access  Public / User
 */
router.get("/", async (req, res) => {
  try {
    const userEmail = req.query.email || "gvdkumar@gmail.com";
    const favorites = await Favorite.find({ userEmail: userEmail.toLowerCase() });
    return res.status(200).json({ success: true, count: favorites.length, favorites });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch favorites", error: error.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    const favorites = await Favorite.find();
    return res.status(200).json({ success: true, count: favorites.length, favorites });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * @route   POST /api/favorite or /api/favorite/add
 * @desc    Add a movie to watchlist
 * @access  Public / User
 */
const handleAddFavorite = async (req, res) => {
  try {
    const { movieId, movieTitle, moviePoster, userEmail } = req.body;

    if (!movieId) {
      return res.status(400).json({ success: false, message: "Movie ID is required" });
    }

    const email = (userEmail || "gvdkumar@gmail.com").toLowerCase();

    // Check if already in favorites
    let favorite = await Favorite.findOne({ userEmail: email, movieId });
    if (favorite) {
      return res.status(200).json({ success: true, message: "Movie is already in favorites", favorite });
    }

    favorite = new Favorite({
      movieId,
      movieTitle: movieTitle || "Movie",
      moviePoster: moviePoster || "",
      userEmail: email
    });

    await favorite.save();
    return res.status(201).json({ success: true, message: "Added to favorites", favorite });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to add favorite", error: error.message });
  }
};

router.post("/", handleAddFavorite);
router.post("/add", handleAddFavorite);

/**
 * @route   DELETE /api/favorite/:movieId or /api/favorite/remove/:movieId
 * @desc    Remove a movie from favorites
 * @access  Public / User
 */
const handleRemoveFavorite = async (req, res) => {
  try {
    const { movieId } = req.params;
    const userEmail = req.query.email || "gvdkumar@gmail.com";

    await Favorite.findOneAndDelete({
      $or: [
        { _id: movieId },
        { movieId: movieId, userEmail: userEmail.toLowerCase() }
      ]
    });

    return res.status(200).json({ success: true, message: "Removed from favorites" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to remove favorite", error: error.message });
  }
};

router.delete("/:movieId", handleRemoveFavorite);
router.delete("/remove/:movieId", handleRemoveFavorite);

module.exports = router;

