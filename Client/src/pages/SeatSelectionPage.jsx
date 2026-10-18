import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMovies } from '../context/MovieContext';
import { useAuth } from '../context/AuthContext';

export default function SeatSelectionPage() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { shows, movies, theatres, bookSeats } = useMovies();

  const show = shows.find((s) => s.id === showId);
  const movie = show ? movies.find((m) => m.id === show.movieId || m.title.toLowerCase() === show.movieTitle.toLowerCase()) : null;
  const theatre = show ? theatres.find((t) => t.id === show.theatreId || t.name.toLowerCase() === show.theatreName.toLowerCase()) : null;

  // Selected seats state: array of objects { key: 'M-261', tier: 'Middle', seatNum: '261', price: 130 }
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showDemoCheckout, setShowDemoCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  // Theatre pricing and configuration (falls back to defaults if not specified)
  const balconyPrice = theatre?.balconyPrice || 175;
  const middlePrice = theatre?.middlePrice || 130;
  const lowerPrice = theatre?.lowerPrice || 100;

  // Generate seat matrices for 3 tiers
  const balconyRows = ['A', 'B'];
  const middleRows = ['C', 'D', 'E', 'F'];
  const lowerRows = ['G', 'H'];
  const seatsPerRow = 12;

  // Set of booked seat keys for quick collision check
  const bookedSeatSet = useMemo(() => {
    return new Set(show?.bookedSeats || []);
  }, [show]);

  if (!show || !movie) {
    return (
      <div className="container py-5 text-center">
        <h3>Show not found</h3>
        <Link to="/movies" className="btn-cinema-red mt-3">
          Back to Movies
        </Link>
      </div>
    );
  }

  const handleSeatToggle = (seatKey, tier, seatNum, price) => {
    if (bookedSeatSet.has(seatKey)) return;

    setSelectedSeats((prev) => {
      const exists = prev.some((s) => s.key === seatKey);
      if (exists) {
        return prev.filter((s) => s.key !== seatKey);
      } else {
        if (prev.length >= 8) {
          alert('You can select a maximum of 8 seats per booking.');
          return prev;
        }
        return [...prev, { key: seatKey, tier, seatNum, price }];
      }
    });
  };

  // Group selected seats for summary label matching Screenshot 10
  const seatSummaryText = useMemo(() => {
    if (selectedSeats.length === 0) return '';
    const tiers = {};
    selectedSeats.forEach((s) => {
      if (!tiers[s.tier]) tiers[s.tier] = [];
      tiers[s.tier].push(s.seatNum);
    });
    return Object.entries(tiers)
      .map(([tier, nums]) => `${tier} Seats: ${nums.join(', ')}`)
      .join(' | ');
  }, [selectedSeats]);

  const subtotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const convenienceFee = selectedSeats.length > 0 ? 30 : 0;
  const totalAmount = subtotal + convenienceFee;

  const handleConfirmBooking = () => {
    if (selectedSeats.length === 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      const primaryTier = selectedSeats[0]?.tier || 'Middle';
      const seatNumbers = selectedSeats.map((s) => s.seatNum);

      bookSeats({
        showId: show.id,
        movieId: movie.id,
        movieTitle: movie.title,
        moviePoster: movie.poster,
        theatreName: show.theatreName,
        showDate: show.showDate,
        showTime: show.showTime,
        tierName: primaryTier,
        seats: seatNumbers,
        seatSummary: seatSummaryText,
        totalPrice: totalAmount,
        selectedSeatKeys: selectedSeats.map((s) => s.key),
        userEmail: user ? user.email : 'guest@imovies.com'
      });

      setIsProcessing(false);
      setShowDemoCheckout(false);
      navigate('/bookings');
    }, 1200);
  };

  // Render a tier section of seats
  const renderSeatTier = (tierName, rows, price, codePrefix) => (
    <div className="mb-4 text-center">
      <div className="d-flex justify-content-between align-items-center mb-2 px-3 border-bottom pb-1" style={{ borderColor: 'var(--im-border-color)' }}>
        <h6 className="fw-bold mb-0 text-white">
          {tierName} Section &bull; <span className="text-danger">₹{price}</span>
        </h6>
        <span className="small text-secondary">Rows {rows[0]} - {rows[rows.length - 1]}</span>
      </div>

      <div className="d-flex flex-column align-items-center gap-1">
        {rows.map((row) => (
          <div key={row} className="d-flex align-items-center gap-1">
            <span className="text-secondary small fw-bold me-2" style={{ width: '20px' }}>
              {row}
            </span>
            <div className="d-flex gap-1">
              {[...Array(seatsPerRow)].map((_, idx) => {
                const seatIndex = idx + 1;
                // Form seat numbers like 261, 262 or 142 as shown in Screenshot 10
                const numericSeatNum = codePrefix === 'M' ? 250 + (rows.indexOf(row) * seatsPerRow + seatIndex) : (codePrefix === 'B' ? 140 + seatIndex : 100 + seatIndex);
                const seatKey = `${codePrefix}-${numericSeatNum}`;
                const isBooked = bookedSeatSet.has(seatKey);
                const isSelected = selectedSeats.some((s) => s.key === seatKey);

                return (
                  <button
                    key={seatKey}
                    type="button"
                    disabled={isBooked}
                    className={`seat-btn ${isBooked ? 'booked' : isSelected ? 'selected' : 'available'}`}
                    onClick={() => handleSeatToggle(seatKey, tierName, String(numericSeatNum), price)}
                    title={`Seat ${row}${seatIndex} (${seatKey}) - ₹${price} ${isBooked ? '[Booked]' : ''}`}
                  >
                    {isBooked ? '✕' : seatIndex}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container py-4">
      {/* Show header banner */}
      <div className="p-3 rounded-3 border mb-4 d-flex flex-wrap justify-content-between align-items-center gap-3" style={{ backgroundColor: 'var(--im-bg-card)', borderColor: 'var(--im-border-color)' }}>
        <div>
          <h4 className="fw-bold text-white mb-1">
            {movie.title} &bull; <span className="text-danger">{show.theatreName}</span>
          </h4>
          <div className="text-secondary small">
            <i className="bi bi-calendar-event text-danger me-1"></i> {show.showDate} &bull;{' '}
            <i className="bi bi-clock text-danger me-1"></i> {show.showTime}
          </div>
        </div>
        <Link to={`/movie/${movie.id}`} className="btn btn-sm btn-cinema-outline">
          &larr; Change Show
        </Link>
      </div>

      <div className="row g-4">
        {/* Visual Seating Layout */}
        <div className="col-lg-8">
          <div className="p-4 rounded-3 border" style={{ backgroundColor: 'var(--im-bg-card)', borderColor: 'var(--im-border-color)' }}>
            {/* Curved cinema screen indicator */}
            <div className="cinema-screen">
              SCREEN THIS WAY
            </div>

            {/* 3 Tiers Seating Grid matching Screenshot 8 & 10 */}
            {renderSeatTier('Balcony', balconyRows, balconyPrice, 'B')}
            {renderSeatTier('Middle', middleRows, middlePrice, 'M')}
            {renderSeatTier('Lower', lowerRows, lowerPrice, 'L')}

            {/* Legend */}
            <div className="d-flex justify-content-center gap-4 border-top pt-3 mt-4" style={{ borderColor: 'var(--im-border-color)' }}>
              <div className="d-flex align-items-center gap-2 small text-secondary">
                <span className="seat-btn available" style={{ width: '20px', height: '20px' }}></span>
                <span>Available</span>
              </div>
              <div className="d-flex align-items-center gap-2 small text-secondary">
                <span className="seat-btn selected" style={{ width: '20px', height: '20px' }}></span>
                <span>Selected</span>
              </div>
              <div className="d-flex align-items-center gap-2 small text-secondary">
                <span className="seat-btn booked" style={{ width: '20px', height: '20px' }}>✕</span>
                <span>Sold / Booked</span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Summary Panel */}
        <div className="col-lg-4">
          <div className="p-4 rounded-3 border position-sticky" style={{ top: '90px', backgroundColor: 'var(--im-bg-card)', borderColor: 'var(--im-border-color)' }}>
            <h5 className="fw-bold text-white mb-3 border-bottom pb-2" style={{ borderColor: 'var(--im-border-color)' }}>
              Booking Summary
            </h5>

            <div className="d-flex gap-3 mb-3">
              <img
                src={movie.poster}
                alt={movie.title}
                className="rounded"
                style={{ width: '60px', height: '85px', objectFit: 'cover' }}
              />
              <div>
                <h6 className="fw-bold text-white mb-1">{movie.title}</h6>
                <div className="text-secondary small">{show.theatreName}</div>
                <div className="text-danger small fw-semibold">{show.showDate} | {show.showTime}</div>
              </div>
            </div>

            <div className="mb-3">
              <label className="text-secondary small d-block">Selected Seats:</label>
              {selectedSeats.length === 0 ? (
                <span className="text-muted small fst-italic">No seats selected yet</span>
              ) : (
                <div className="fw-semibold text-white small">
                  {seatSummaryText}
                </div>
              )}
            </div>

            <div className="border-top pt-3 mb-3" style={{ borderColor: 'var(--im-border-color)' }}>
              <div className="d-flex justify-content-between small text-secondary mb-1">
                <span>Tickets ({selectedSeats.length}):</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="d-flex justify-content-between small text-secondary mb-2">
                <span>Convenience Fee:</span>
                <span>₹{convenienceFee}</span>
              </div>
              <div className="d-flex justify-content-between fw-bold text-white fs-5 border-top pt-2" style={{ borderColor: 'var(--im-border-color)' }}>
                <span>Total Amount:</span>
                <span className="text-danger">₹{totalAmount}</span>
              </div>
            </div>

            <button
              className="btn-cinema-red w-100 py-2 fs-6"
              disabled={selectedSeats.length === 0}
              onClick={() => setShowDemoCheckout(true)}
            >
              Proceed to Demo Checkout
            </button>
            <p className="text-center text-muted small mt-2 mb-0">
              <i className="bi bi-shield-check me-1"></i> Demo booking mode
            </p>
          </div>
        </div>
      </div>

      {/* Demo Checkout Modal */}
      {showDemoCheckout && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ backgroundColor: 'var(--im-bg-card)', borderColor: 'var(--im-primary)' }}>
              {/* Header */}
              <div className="modal-header border-bottom border-secondary">
                <div>
                  <h5 className="modal-title fw-bold text-white">
                    <i className="bi bi-credit-card-2-front text-danger me-2"></i>
                    Demo Checkout
                  </h5>
                  <span className="badge bg-warning text-dark text-xs mt-1">
                    College Project Simulation (No Real Money)
                  </span>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowDemoCheckout(false)}
                ></button>
              </div>

              {/* Body */}
              <div className="modal-body p-4">
                <div className="p-3 rounded-3 mb-3" style={{ backgroundColor: 'var(--im-bg-input)' }}>
                  <div className="d-flex justify-content-between small text-secondary mb-1">
                    <span>Movie:</span>
                    <strong className="text-white">{movie.title}</strong>
                  </div>
                  <div className="d-flex justify-content-between small text-secondary mb-1">
                    <span>Theatre:</span>
                    <strong className="text-white">{show.theatreName}</strong>
                  </div>
                  <div className="d-flex justify-content-between small text-secondary mb-1">
                    <span>Seats:</span>
                    <strong className="text-danger">{seatSummaryText}</strong>
                  </div>
                  <div className="d-flex justify-content-between small text-secondary mb-1">
                    <span>Date & Time:</span>
                    <strong className="text-white">{show.showDate} | {show.showTime}</strong>
                  </div>
                  <div className="d-flex justify-content-between fw-bold text-white border-top border-secondary pt-2 mt-2">
                    <span>Payable Total:</span>
                    <span className="text-danger fs-5">₹{totalAmount}</span>
                  </div>
                </div>

                <label className="im-form-label mb-2">Select Demo Payment Method:</label>
                <div className="d-flex flex-column gap-2 mb-4">
                  <div
                    className={`p-3 rounded border cursor-pointer d-flex align-items-center gap-3 ${paymentMethod === 'upi' ? 'border-danger' : 'border-secondary'}`}
                    style={{ backgroundColor: paymentMethod === 'upi' ? 'rgba(229, 9, 20, 0.1)' : 'var(--im-bg-input)', cursor: 'pointer' }}
                    onClick={() => setPaymentMethod('upi')}
                  >
                    <i className="bi bi-qr-code-scan fs-4 text-danger"></i>
                    <div>
                      <strong className="d-block text-white">UPI / QR Code (Demo)</strong>
                      <span className="small text-secondary">Google Pay, PhonePe, Paytm simulation</span>
                    </div>
                  </div>

                  <div
                    className={`p-3 rounded border cursor-pointer d-flex align-items-center gap-3 ${paymentMethod === 'card' ? 'border-danger' : 'border-secondary'}`}
                    style={{ backgroundColor: paymentMethod === 'card' ? 'rgba(229, 9, 20, 0.1)' : 'var(--im-bg-input)', cursor: 'pointer' }}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <i className="bi bi-credit-card fs-4 text-danger"></i>
                    <div>
                      <strong className="d-block text-white">Credit / Debit Card (Demo)</strong>
                      <span className="small text-secondary">Mock sandbox test card</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-cinema-red w-100 py-2 fs-6"
                  disabled={isProcessing}
                  onClick={handleConfirmBooking}
                >
                  {isProcessing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Simulating Payment Confirmation...
                    </>
                  ) : (
                    `Pay ₹${totalAmount} & Confirm Booking`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

