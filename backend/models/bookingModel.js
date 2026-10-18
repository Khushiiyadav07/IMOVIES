const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true
    },
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
      type: String
    },
    movieTitle: {
      type: String,
      required: true
    },
    moviePoster: {
      type: String
    },
    theatreName: {
      type: String,
      required: true
    },
    showId: {
      type: String
    },
    showDate: {
      type: String,
      required: true
    },
    showTime: {
      type: String,
      required: true
    },
    tierName: {
      type: String,
      default: "Middle"
    },
    seats: {
      type: [String],
      default: []
    },
    seatSummary: {
      type: String
    },
    totalPrice: {
      type: Number,
      required: true
    },
    paymentStatus: {
      type: String,
      default: "Completed (Demo Payment)"
    },
    status: {
      type: String,
      default: "Confirmed"
    },
    bookingDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Booking", bookingSchema);

