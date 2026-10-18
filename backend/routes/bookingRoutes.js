const express = require("express");
const router = express.Router();
const Booking = require("../models/bookingModel");
const Show = require("../models/showModel");
const { sendEmail } = require("../utils/mailer");

/**
 * @route   POST /api/bookings/create or /api/bookings/book or /api/bookings
 * @desc    Create a new movie ticket booking with seat validation & email confirmation
 * @access  Public / Authenticated
 */
const handleCreateBooking = async (req, res) => {
  try {
    const {
      showId,
      movieId,
      movieTitle,
      moviePoster,
      theatreName,
      showDate,
      showTime,
      tierName,
      seats,
      seatSummary,
      totalPrice,
      selectedSeatKeys,
      userEmail,
      userId
    } = req.body;

    if (!movieTitle || !theatreName || !totalPrice || !userEmail) {
      return res.status(400).json({
        success: false,
        message: "Missing required booking details (movieTitle, theatreName, totalPrice, userEmail)."
      });
    }

    // Real-time seat collision check if showId provided
    if (showId && selectedSeatKeys && selectedSeatKeys.length > 0) {
      const show = await Show.findById(showId);
      if (show) {
        const alreadyBooked = selectedSeatKeys.some((seat) => show.bookedSeats.includes(seat));
        if (alreadyBooked) {
          return res.status(409).json({
            success: false,
            message: "One or more of the selected seats have just been reserved. Please choose different seats."
          });
        }

        // Reserve seats in show model
        show.bookedSeats.push(...selectedSeatKeys);
        await show.save();
      }
    }

    // Generate unique college-style booking ID e.g. IMV-83921
    const generatedBookingId = "IMV-" + Math.floor(10000 + Math.random() * 90000);

    const booking = new Booking({
      bookingId: generatedBookingId,
      userId,
      userEmail,
      movieId,
      movieTitle,
      moviePoster: moviePoster || "https://image.tmdb.org/t/p/w500/wE0noIQUSNaqqaG014902bB8fl8.jpg",
      theatreName,
      showId,
      showDate,
      showTime,
      tierName: tierName || "Middle",
      seats: seats || [],
      seatSummary: seatSummary || `${tierName || 'Middle'} Seats: ${seats?.join(', ')}`,
      totalPrice: Number(totalPrice),
      paymentStatus: "Completed (Demo Payment)",
      status: "Confirmed",
      bookingDate: new Date()
    });

    await booking.save();

    // Trigger non-blocking confirmation email notification
    sendEmail({
      to: userEmail,
      subject: `iMovies Ticket Confirmation: ${movieTitle} (${generatedBookingId})`,
      html: `
        <h2>Booking Confirmed!</h2>
        <p>Thank you for booking with <strong>iMovies</strong>.</p>
        <p><strong>Booking ID:</strong> ${generatedBookingId}</p>
        <p><strong>Movie:</strong> ${movieTitle}</p>
        <p><strong>Theatre:</strong> ${theatreName}</p>
        <p><strong>Date & Time:</strong> ${showDate} | ${showTime}</p>
        <p><strong>Seats:</strong> ${booking.seatSummary}</p>
        <p><strong>Total Paid:</strong> ₹${totalPrice} (Demo)</p>
      `
    });

    return res.status(201).json({
      success: true,
      message: "Ticket booked successfully! Booking confirmed.",
      booking
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process booking",
      error: error.message
    });
  }
};

router.post("/", handleCreateBooking);
router.post("/create", handleCreateBooking);
router.post("/book", handleCreateBooking);

/**
 * @route   GET /api/bookings or /api/bookings/all
 * @desc    Get all bookings (Admin Dashboard)
 * @access  Public / Admin
 */
router.get("/", async (req, res) => {
  try {
    const { email } = req.query;
    let query = {};
    if (email) {
      query.userEmail = email.toLowerCase();
    }
    const bookings = await Booking.find(query).sort({ bookingDate: -1 });
    return res.status(200).json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch bookings" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ bookingDate: -1 });
    return res.status(200).json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch bookings" });
  }
});

/**
 * @route   GET /api/bookings/my-bookings
 * @desc    Get user's booking history
 * @access  Public / User
 */
router.get("/my-bookings", async (req, res) => {
  try {
    const email = req.query.email || "gvdkumar@gmail.com";
    const bookings = await Booking.find({ userEmail: email.toLowerCase() }).sort({ bookingDate: -1 });
    return res.status(200).json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch user bookings" });
  }
});

/**
 * @route   DELETE /api/bookings/:id or /api/bookings/cancel/:id
 * @desc    Cancel a ticket booking and release seats
 * @access  User / Admin
 */
const handleCancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      $or: [{ _id: req.params.id }, { bookingId: req.params.id }]
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Release seats in Show model if showId exists
    if (booking.showId && booking.seats) {
      const show = await Show.findById(booking.showId);
      if (show) {
        show.bookedSeats = show.bookedSeats.filter(
          (seatKey) => !booking.seats.some((s) => seatKey.includes(s))
        );
        await show.save();
      }
    }

    await Booking.findByIdAndDelete(booking._id);

    return res.status(200).json({
      success: true,
      message: `Booking ${booking.bookingId} cancelled and seats released.`
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to cancel booking", error: error.message });
  }
};

router.delete("/:id", handleCancelBooking);
router.delete("/cancel/:id", handleCancelBooking);

module.exports = router;

