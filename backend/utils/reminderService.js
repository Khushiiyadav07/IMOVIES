const Booking = require("../models/bookingModel");
const { sendEmail } = require("./mailer");

/**
 * Scheduled service to send showtime reminder emails to moviegoers
 */
const sendReminderEmails = async () => {
  try {
    const today = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });

    const upcomingBookings = await Booking.find({
      status: "Confirmed",
      showDate: today
    }).limit(10);

    for (const booking of upcomingBookings) {
      console.log(`⏰ [Reminder Service] Reminder queued for ${booking.userEmail} for show: ${booking.movieTitle} at ${booking.showTime}`);
      await sendEmail({
        to: booking.userEmail,
        subject: `Reminder: Your iMovies show starts today! (${booking.movieTitle})`,
        html: `<h3>Hello Movie Lover!</h3><p>Your show for <strong>${booking.movieTitle}</strong> at <strong>${booking.theatreName}</strong> is scheduled for today at <strong>${booking.showTime}</strong>.</p><p>Seats: ${booking.seatSummary}</p><p>Booking ID: ${booking.bookingId}</p>`
      });
    }
  } catch (error) {
    console.error("Error in sendReminderEmails:", error.message);
  }
};

module.exports = {
  sendReminderEmails
};

