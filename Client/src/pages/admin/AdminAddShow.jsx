import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMovies } from '../../context/MovieContext';

export default function AdminAddShow() {
  const navigate = useNavigate();
  const { movies, theatres, addShow } = useMovies();

  const [theatreId, setTheatreId] = useState('');
  const [movieId, setMovieId] = useState('');
  const [showDate, setShowDate] = useState('');
  const [showTime, setShowTime] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!theatreId || !movieId || !showDate || !showTime) {
      alert('Please select Theatre, Movie, Show Date, and Showtime.');
      return;
    }

    const formattedDate = new Date(showDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    // Format time nicely if 24hr string
    let formattedTime = showTime;
    try {
      const [hours, minutes] = showTime.split(':');
      const h = parseInt(hours, 10);
      const ampm = h >= 12 ? 'PM' : 'AM';
      const formattedH = h % 12 || 12;
      formattedTime = `${formattedH}:${minutes} ${ampm}`;
    } catch (err) {
      // fallback
    }

    addShow({
      movieId,
      theatreId,
      showDate: formattedDate,
      showTime: formattedTime
    });

    setMessage('Show scheduled successfully! Redirecting to Admin Dashboard...');
    setTimeout(() => {
      navigate('/admin');
    }, 1000);
  };

  return (
    <div className="im-admin-wrapper">
      {/* Title matching Screenshot: "Add Show" with Show in red */}
      <h2 className="fw-bold mb-4 text-center">
        Add <span style={{ color: 'var(--im-primary)' }}>Show</span>
      </h2>

      <div className="im-admin-form-card">
        {message && (
          <div className="alert alert-success py-2 text-center small mb-3" role="alert">
            <i className="bi bi-check-circle-fill me-2"></i>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Theatres Select dropdown matching Screenshot */}
          <div className="im-form-group mb-3">
            <label className="im-form-label">Theatres</label>
            <select
              className="im-form-control"
              value={theatreId}
              onChange={(e) => setTheatreId(e.target.value)}
              required
            >
              <option value="">Select Theatre</option>
              {theatres.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Movies Select dropdown matching Screenshot */}
          <div className="im-form-group mb-3">
            <label className="im-form-label">Movies</label>
            <select
              className="im-form-control"
              value={movieId}
              onChange={(e) => setMovieId(e.target.value)}
              required
            >
              <option value="">Select Movie</option>
              {movies.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>

          {/* Show Date */}
          <div className="im-form-group mb-3">
            <label className="im-form-label">Show Date</label>
            <input
              type="date"
              className="im-form-control"
              value={showDate}
              onChange={(e) => setShowDate(e.target.value)}
              required
            />
          </div>

          {/* Showtime */}
          <div className="im-form-group mb-4">
            <label className="im-form-label">Showtime</label>
            <input
              type="time"
              className="im-form-control"
              value={showTime}
              onChange={(e) => setShowTime(e.target.value)}
              required
            />
          </div>

          {/* Submit Button matching Screenshot */}
          <div className="text-center">
            <button type="submit" className="btn-cinema-red px-4 py-2">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
