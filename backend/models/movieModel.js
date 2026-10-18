const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    genres: {
      type: String,
      required: true
    },
    runtime: {
      type: String,
      default: "150 min"
    },
    trailerUrl: {
      type: String,
      default: ""
    },
    releaseDate: {
      type: String,
      default: "Coming Soon"
    },
    certification: {
      type: String,
      default: "U/A"
    },
    poster: {
      type: String,
      default: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60"
    },
    backdrop: {
      type: String,
      default: ""
    },
    rating: {
      type: Number,
      default: 4.5
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Movie", movieSchema);

