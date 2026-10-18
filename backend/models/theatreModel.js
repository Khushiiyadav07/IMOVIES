const mongoose = require("mongoose");

const theatreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    balconyPrice: {
      type: Number,
      default: 175
    },
    balconySeats: {
      type: Number,
      default: 50
    },
    middlePrice: {
      type: Number,
      default: 130
    },
    middleSeats: {
      type: Number,
      default: 120
    },
    lowerPrice: {
      type: Number,
      default: 100
    },
    lowerSeats: {
      type: Number,
      default: 80
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Theatre", theatreSchema);

