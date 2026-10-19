import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMovies } from '../context/MovieContext';
import { useAuth } from '../context/AuthContext';
import { getPosterUrl } from '../utils/imageUtils';

export default function BookingsPage() {
  const { bookings, cancelBooking } = useMovies();
  const { user } = useAuth();
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Filter bookings for current user if applicable
  const userBookings = user
    ? bookings.filter((b) => !b.userEmail || b.userEmail === user.email || user.email === 'gvdkumar@gmail.com')
    : bookings;

  const handleCancel = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      cancelBooking(bookingId);
    }
  };

  return (
    <div className="container py-4">
      {/* Title matching Screenshot 10: "Your Bookings" */}
      <h2 className="text-center fw-bold mb-4">
        Your <span style={{ color: 'var(--im-primary)' }}>Bookings</span>
      </h2>

      {userBookings.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-ticket-detailed text-secondary display-3 mb-3 d-block"></i>
          <h4 className="fw-semibold">No bookings found</h4>
          <p className="text-secondary">You haven't booked any movie tickets yet.</p>
          <Link to="/movies" className="btn-cinema-red mt-2">
            Explore Now Showing Movies
          </Link>
        </div>
      ) : (
        /* Cards Grid matching Screenshot 10 */
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {userBookings.map((b) => (
            <div key={b.id || b.bookingId} className="col">
              <div className="booking-ticket-card h-100 position-relative">
                {/* Poster on left */}
                <div className="booking-ticket-poster">
                  <img
                    src={getPosterUrl(b.moviePoster) || 'https://image.tmdb.org/t/p/w500/wE0noIQUSNaqqaG014902bB8fl8.jpg'}
                    alt={b.movieTitle}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60";
                    }}
                  />
                </div>

                {/* Details on right matching Screenshot 10 */}
                <div className="booking-ticket-details">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-secondary bg-opacity-50 text-white font-monospace small">
                      {b.bookingId}
                    </span>
                    <button
                      className="btn btn-sm btn-link text-secondary p-0 text-decoration-none"
                      onClick={() => handleCancel(b.id || b.bookingId)}
                      title="Cancel Booking"
                    >
                      <i className="bi bi-trash text-danger"></i>
                    </button>
                  </div>

                  <div className="booking-detail-row">
                    <span>Movie: </span>
                    <strong>{b.movieTitle}</strong>
                  </div>

                  <div className="booking-detail-row">
                    <span>Theatre: </span>
                    <strong>{b.theatreName}</strong>
                  </div>

                  <div className="booking-detail-row">
                    <span>Showdate: </span>
                    <strong>{b.showDate}</strong>
                  </div>

                  <div className="booking-detail-row">
                    <span>Showtime: </span>
                    <strong>{b.showTime}</strong>
                  </div>

                  <div className="booking-detail-row text-danger">
                    <span>{b.seatSummary || `${b.tierName || 'Middle'} Seats: ${b.seats?.join(', ')}`}</span>
                  </div>

                  <div className="booking-detail-row mt-2 pt-1 border-top" style={{ borderColor: 'var(--im-border-color)' }}>
                    <span>Total Price: </span>
                    <strong className="text-white fs-6">{b.totalPrice}₹</strong>
                  </div>

                  <div className="mt-2 pt-1">
                    <button
                      className="btn btn-sm btn-outline-danger w-100 py-1"
                      onClick={() => setSelectedTicket(b)}
                    >
                      <i className="bi bi-qr-code me-1"></i> View Ticket QR
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ticket QR Modal */}
      {selectedTicket && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 1050 }}
          onClick={() => setSelectedTicket(null)}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content text-center p-4" style={{ backgroundColor: 'var(--im-bg-card)', borderColor: 'var(--im-primary)' }}>
              <div className="modal-header border-0 pb-0 justify-content-end">
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedTicket(null)}
                ></button>
              </div>
              <div className="modal-body pt-0">
                <div className="brand-logo justify-content-center mb-2">
                  <span className="brand-i">i</span>
                  <span className="brand-movies">Movies</span>
                </div>
                <h5 className="fw-bold text-white mb-1">{selectedTicket.movieTitle}</h5>
                <p className="text-secondary small mb-3">
                  {selectedTicket.theatreName} &bull; {selectedTicket.showDate} at {selectedTicket.showTime}
                </p>

                {/* QR Code graphic */}
                <div className="p-3 bg-white rounded-3 d-inline-block shadow mb-3">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                      `iMovies Booking ${selectedTicket.bookingId} - ${selectedTicket.movieTitle} - Seats: ${selectedTicket.seatSummary}`
                    )}`}
                    alt="Ticket QR Code"
                    style={{ width: '150px', height: '150px' }}
                  />
                </div>

                <div className="p-2 rounded border" style={{ backgroundColor: 'var(--im-bg-input)', borderColor: 'var(--im-border-color)' }}>
                  <div className="small text-secondary">Booking Reference</div>
                  <div className="fw-bold text-danger fs-6">{selectedTicket.bookingId}</div>
                  <div className="small text-white mt-1">{selectedTicket.seatSummary}</div>
                </div>

                <button
                  className="btn btn-sm btn-cinema-red mt-3 w-100"
                  onClick={() => window.print()}
                >
                  <i className="bi bi-printer me-2"></i> Print Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

