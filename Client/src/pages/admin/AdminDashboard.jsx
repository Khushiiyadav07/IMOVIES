import React from 'react';
import { Link } from 'react-router-dom';
import { useMovies } from '../../context/MovieContext';

export default function AdminDashboard() {
  const { shows, bookings, deleteShow } = useMovies();

  const handleDeleteShow = (showId) => {
    if (window.confirm('Are you sure you want to delete this show?')) {
      deleteShow(showId);
    }
  };

  return (
    <div className="container py-4">
      {/* Admin Action Shortcuts */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom" style={{ borderColor: 'var(--im-border-color)' }}>
        <div>
          <h4 className="fw-bold mb-1 text-white">
            <i className="bi bi-speedometer2 text-danger me-2"></i>
            Admin Control Center
          </h4>
          <span className="text-secondary small">Manage shows, movies, theatres, and track user bookings</span>
        </div>
        <div className="d-flex flex-wrap gap-2 mt-2 mt-md-0">
          <Link to="/admin/add-movie" className="btn btn-sm btn-outline-danger">
            <i className="bi bi-film me-1"></i> Add Movie
          </Link>
          <Link to="/admin/add-theatre" className="btn btn-sm btn-outline-danger">
            <i className="bi bi-masks-theater me-1"></i> Add Theatre
          </Link>
          <Link to="/admin/add-show" className="btn btn-sm btn-cinema-red">
            <i className="bi bi-plus-circle me-1"></i> Add Show
          </Link>
        </div>
      </div>

      {/* Section 1: "Admin Shows" matching Screenshot 4 */}
      <h3 className="fw-bold mb-3" style={{ color: 'var(--im-primary)' }}>
        Admin Shows
      </h3>

      {shows.length === 0 ? (
        <div className="p-4 rounded-3 border text-center mb-5" style={{ backgroundColor: 'var(--im-bg-card)', borderColor: 'var(--im-border-color)' }}>
          <p className="text-secondary mb-2">No shows scheduled currently.</p>
          <Link to="/admin/add-show" className="btn btn-sm btn-cinema-red">
            Schedule a New Show
          </Link>
        </div>
      ) : (
        /* Shows Grid matching Screenshot 4 */
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3 mb-5">
          {shows.map((show) => (
            <div key={show.id} className="col">
              <div className="admin-show-card h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <i className="bi bi-film text-danger fs-5"></i>
                    <strong className="text-white fs-6">Movie: {show.movieTitle}</strong>
                  </div>

                  <div className="show-label">Theatre: <span className="show-value">{show.theatreName}</span></div>
                  <div className="show-label">Showdate: <span className="show-value">{show.showDate}</span></div>
                  <div className="show-label mb-3">Showtime: <span className="show-value">{show.showTime}</span></div>
                </div>

                <div className="d-flex justify-content-end border-top pt-2" style={{ borderColor: 'var(--im-border-color)' }}>
                  <button
                    className="btn btn-sm btn-outline-danger py-1 px-3"
                    onClick={() => handleDeleteShow(show.id)}
                    title="Delete Show"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Section 2: "All Bookings" matching Screenshot 4 */}
      <h3 className="fw-bold mb-3" style={{ color: 'var(--im-primary)' }}>
        All Bookings
      </h3>

      {bookings.length === 0 ? (
        <div className="p-4 rounded-3 border text-center" style={{ backgroundColor: 'var(--im-bg-card)', borderColor: 'var(--im-border-color)' }}>
          <p className="text-secondary mb-0">No user bookings recorded yet.</p>
        </div>
      ) : (
        /* Bookings Grid/Cards matching Screenshot 4 */
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
          {bookings.map((b) => (
            <div key={b.id || b.bookingId} className="col">
              <div className="p-3 rounded-3 border h-100" style={{ backgroundColor: 'var(--im-bg-card)', borderColor: 'var(--im-border-color)' }}>
                <div className="d-flex align-items-center gap-2 mb-2 pb-2 border-bottom" style={{ borderColor: 'var(--im-border-color)' }}>
                  <i className="bi bi-person-circle text-danger fs-5"></i>
                  <span className="text-white small fw-semibold text-truncate">
                    User: {b.userEmail || 'gvdkumar@gmail.com'}
                  </span>
                </div>

                <div className="small text-secondary mb-1">
                  Movie: <strong className="text-white">{b.movieTitle}</strong>
                </div>
                <div className="small text-secondary mb-1">
                  Theatre: <span className="text-light">{b.theatreName}</span>
                </div>
                <div className="small text-secondary mb-1">
                  Date & Time: <span className="text-light">{b.showDate} | {b.showTime}</span>
                </div>
                <div className="small text-danger fw-semibold mb-2">
                  {b.seatSummary || `Seats: ${b.seats?.join(', ')}`}
                </div>

                <div className="d-flex justify-content-between align-items-center pt-2 border-top" style={{ borderColor: 'var(--im-border-color)' }}>
                  <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-50">
                    {b.status || 'Confirmed'}
                  </span>
                  <strong className="text-white">{b.totalPrice}₹</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

