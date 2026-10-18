const express = require("express");
const router = express.Router();
const Review = require("../models/reviewModel");

/**
 * @route   GET /api/review or /api/review/all
 * @desc    Get all reviews
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch reviews" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch reviews" });
  }
});

/**
 * @route   GET /api/review/:movieId or /api/review/movie/:movieId
 * @desc    Get all reviews for a specific movie
 * @access  Public
 */
const getMovieReviews = async (req, res) => {
  try {
    const { movieId } = req.params;
    const reviews = await Review.find({ movieId }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch reviews", error: error.message });
  }
};

router.get("/movie/:movieId", getMovieReviews);
router.get("/:movieId", getMovieReviews);

/**
 * @route   POST /api/review or /api/review/add
 * @desc    Post a rating & review for a movie
 * @access  Public / User
 */
const handleAddReview = async (req, res) => {
  try {
    const { movieId, movieTitle, author, userEmail, rating, comment } = req.body;

    if (!movieId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Movie ID, rating (1-5), and comment are required."
      });
    }

    const review = new Review({
      movieId,
      movieTitle: movieTitle || "Movie",
      author: author || (userEmail ? userEmail.split("@")[0] : "Moviegoer"),
      userEmail,
      rating: Number(rating),
      comment,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    });

    await review.save();

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review
    });
  } catch (error) {
    console.error("Error posting review:", error);
    return res.status(500).json({ success: false, message: "Failed to submit review", error: error.message });
  }
};

router.post("/", handleAddReview);
router.post("/add", handleAddReview);

/**
 * @route   DELETE /api/review/:id
 * @desc    Delete a review
 * @access  Admin
 */
router.delete("/:id", async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }
    return res.status(200).json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete review" });
  }
});

module.exports = router;

