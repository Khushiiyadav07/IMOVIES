const Booking = require("../models/bookingModel");

/**
 * Scheduled service to archive or clean up old expired bookings
 */
const cleanupOldBookings = async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await Booking.updateMany(
      {
        bookingDate: { $lt: thirtyDaysAgo },
        status: "Confirmed"
      },
      {
        $set: { status: "Completed" }
      }
    );

    console.log(`🧹 [Cleanup Service] Archive completed: ${result.modifiedCount || 0} old bookings marked as Completed.`);
  } catch (error) {
    console.error("Error in cleanupOldBookings:", error.message);
  }
};

module.exports = {
  cleanupOldBookings
};

