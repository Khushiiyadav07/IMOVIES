const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false
    },
    userEmail: {
      type: String,
      required: true
    },
    movieId: {
      type: String,
      required: true
    },
    movieTitle: {
      type: String
    },
    moviePoster: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate favorites for same user & movie
favoriteSchema.index({ userEmail: 1, movieId: 1 }, { unique: true });

module.exports = mongoose.model("Favorite", favoriteSchema);

