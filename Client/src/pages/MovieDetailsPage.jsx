import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useMovies } from '../context/MovieContext';
import { useAuth } from '../context/AuthContext';
import { getPosterUrl } from '../utils/imageUtils';

export default function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { movies, shows, theatres, isMovieInWatchlist, toggleWatchlist } = useMovies();

  const movie = movies.find((m) => m.id === id);
  const inWatchlist = movie ? isMovieInWatchlist(movie.id) : false;

  const [selectedShow, setSelectedShow] = useState(null);
  const [reviews, setReviews] = useState([
    {
      id: 1,
      author: 'Kiran Sharma',
      rating: 5,
      date: 'Oct 15, 2025',
      comment: 'Mind-blowing cinematic experience! The background score and action sequences were top tier.'
    },
    {
      id: 2,
      author: 'Priya Patel',
      rating: 4,
      date: 'Oct 12, 2025',
      comment: 'Great screenplay and acting. Definitely worth watching in the theatre!'
    }
  ]);
  const [newReviewText, setNewReviewText] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [showTrailerModal, setShowTrailerModal] = useState(false);

  if (!movie) {
    return (
      <div className="container py-5 text-center">
        <h3>Movie not found</h3>
        <Link to="/movies" className="btn-cinema-red mt-3">
          Back to Movies
        </Link>
      </div>
    );
  }

  // Find all shows scheduled for this movie
  const movieShows = shows.filter(
    (s) => s.movieId === movie.id || (s.movieTitle && s.movieTitle.toLowerCase() === movie.title.toLowerCase())
  );

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    const newRev = {
      id: Date.now(),
      author: user ? (user.username || user.email.split('@')[0]) : 'Guest Moviegoer',
      rating: Number(newRating),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      comment: newReviewText.trim()
    };

    setReviews([newRev, ...reviews]);
    setNewReviewText('');
  };

  const handleProceedToBooking = () => {
    if (!selectedShow) return;
    navigate(`/seat-selection/${selectedShow.id}`);
  };

  return (
    <div className="container-fluid px-0">
      {/* Hero Backdrop */}
      <div
        className="position-relative py-5 px-3 px-md-5"
        style={{
          background: `linear-gradient(to bottom, rgba(14, 19, 31, 0.75) 0%, var(--im-bg-main) 100%), url(${getPosterUrl(movie.backdrop || movie.poster)}) center/cover no-repeat`,
          minHeight: '400px'
        }}
      >
        <div className="container py-4">
          <div className="row align-items-center g-4">
            {/* Poster */}
            <div className="col-md-4 col-lg-3 text-center text-md-start">
              <img
                src={getPosterUrl(movie.poster)}
                alt={movie.title}
                className="img-fluid rounded-4 shadow-lg border"
                style={{ maxHeight: '380px', borderColor: 'var(--im-border-color)' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60";
                }}
              />
            </div>

            {/* Details */}
            <div className="col-md-8 col-lg-9">
              <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                <span className="badge bg-danger px-3 py-1 fs-6">{movie.certification || 'U/A'}</span>
                <span className="text-secondary small">&bull;</span>
                <span className="text-secondary">{movie.runtime || '150 min'}</span>
                <span className="text-secondary small">&bull;</span>
                <span className="text-secondary">{movie.releaseDate}</span>
                <span className="badge bg-warning text-dark ms-2">
                  <i className="bi bi-star-fill me-1"></i> {movie.rating || 4.7}/5
                </span>
              </div>

              <h1 className="display-4 fw-bold mb-3 text-capitalize">{movie.title}</h1>

              <p className="lead text-light mb-4" style={{ fontSize: '1.05rem', maxWidth: '750px' }}>
                {movie.description}
              </p>

              <div className="mb-4">
                <span className="text-secondary small d-block mb-1">GENRES</span>
                <div className="d-flex flex-wrap gap-2">
                  {movie.genres.split(',').map((g, idx) => (
                    <span key={idx} className="badge bg-secondary bg-opacity-25 border border-secondary border-opacity-50 px-3 py-1">
                      {g.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="d-flex flex-wrap gap-3">
                <button
                  className={`btn ${inWatchlist ? 'btn-danger' : 'btn-outline-danger'} rounded-pill px-4 py-2`}
                  onClick={() => toggleWatchlist(movie.id)}
                >
                  <i className={`bi ${inWatchlist ? 'bi-heart-fill' : 'bi-heart'} me-2`}></i>
                  {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                </button>

                {movie.trailerUrl && (
                  <button
                    className="btn btn-cinema-outline px-4 py-2"
                    onClick={() => setShowTrailerModal(true)}
                  >
                    <i className="bi bi-play-circle me-2 text-danger"></i> Watch Trailer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Showtimes & Reviews */}
      <div className="container py-5">
        <div className="row g-5">
          {/* Showtimes & Theatres Selection */}
          <div className="col-lg-7">
            <h4 className="fw-bold mb-4 text-white d-flex align-items-center">
              <i className="bi bi-ticket-perforated-fill text-danger me-2"></i>
              Select Theatre & Showtime
            </h4>

            {movieShows.length === 0 ? (
              <div className="p-4 rounded-3 border text-center" style={{ backgroundColor: 'var(--im-bg-card)', borderColor: 'var(--im-border-color)' }}>
                <p className="text-secondary mb-2">No shows scheduled for this movie currently.</p>
                <p className="small text-secondary">
                  Check out other movies or ask an admin to add showtimes for {movie.title}.
                </p>
                <Link to="/movies" className="btn btn-sm btn-cinema-red mt-2">
                  Browse Available Shows
                </Link>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {movieShows.map((show) => {
                  const isSelected = selectedShow?.id === show.id;
                  return (
                    <div
                      key={show.id}
                      onClick={() => setSelectedShow(show)}
                      className="p-3 rounded-3 border cursor-pointer transition-all"
                      style={{
                        backgroundColor: isSelected ? 'var(--im-bg-card-hover)' : 'var(--im-bg-card)',
                        borderColor: isSelected ? 'var(--im-primary)' : 'var(--im-border-color)',
                        boxShadow: isSelected ? '0 0 15px rgba(229, 9, 20, 0.3)' : 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="fw-bold mb-1 text-white">
                            <i className="bi bi-building text-danger me-2"></i>
                            {show.theatreName}
                          </h6>
                          <div className="small text-secondary">
                            <i className="bi bi-calendar-event me-1"></i> {show.showDate} &bull;{' '}
                            <i className="bi bi-clock me-1"></i> {show.showTime}
                          </div>
                        </div>
                        <div className="text-end">
                          <button
                            type="button"
                            className={`btn btn-sm ${isSelected ? 'btn-danger' : 'btn-outline-danger'} rounded-pill px-3`}
                          >
                            {isSelected ? 'Selected' : 'Select Show'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Continue to Seat Selection */}
                {selectedShow && (
                  <div className="mt-4 p-3 rounded-3 border border-danger text-center" style={{ backgroundColor: 'rgba(229, 9, 20, 0.08)' }}>
                    <div className="mb-2">
                      Selected: <strong>{selectedShow.theatreName}</strong> on <strong>{selectedShow.showDate}</strong> at <strong>{selectedShow.showTime}</strong>
                    </div>
                    <button
                      onClick={handleProceedToBooking}
                      className="btn-cinema-red px-5 py-2 fs-6"
                    >
                      Choose Seats &rarr;
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Reviews & Ratings Section */}
          <div className="col-lg-5">
            <h4 className="fw-bold mb-4 text-white d-flex align-items-center">
              <i className="bi bi-chat-square-quote-fill text-danger me-2"></i>
              Audience Reviews ({reviews.length})
            </h4>

            {/* Add Review Box */}
            <div className="p-3 rounded-3 border mb-4" style={{ backgroundColor: 'var(--im-bg-card)', borderColor: 'var(--im-border-color)' }}>
              <h6 className="fw-semibold mb-2 text-white">Rate & Review this Movie</h6>
              <form onSubmit={handleAddReview}>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="small text-secondary">Rating:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i
                      key={star}
                      className={`bi ${star <= newRating ? 'bi-star-fill text-warning' : 'bi-star text-secondary'} cursor-pointer fs-5`}
                      onClick={() => setNewRating(star)}
                      style={{ cursor: 'pointer' }}
                    ></i>
                  ))}
                  <span className="small text-white ms-1">({newRating}/5)</span>
                </div>
                <textarea
                  className="im-form-control mb-2"
                  rows="2"
                  placeholder="Share your thoughts about this movie..."
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                />
                <button type="submit" className="btn btn-sm btn-cinema-red">
                  Post Review
                </button>
              </form>
            </div>

            {/* Reviews List */}
            <div className="d-flex flex-column gap-3">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-3 rounded-3 border" style={{ backgroundColor: 'var(--im-bg-card)', borderColor: 'var(--im-border-color)' }}>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <strong className="text-white small">{rev.author}</strong>
                    <div className="text-warning small">
                      {[...Array(rev.rating)].map((_, i) => (
                        <i key={i} className="bi bi-star-fill me-1"></i>
                      ))}
                    </div>
                  </div>
                  <div className="text-secondary small mb-2">{rev.date}</div>
                  <p className="mb-0 text-light small">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailerModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 1050 }}
          onClick={() => setShowTrailerModal(false)}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content" style={{ backgroundColor: 'var(--im-bg-card)', borderColor: 'var(--im-primary)' }}>
              <div className="modal-header border-bottom border-secondary">
                <h5 className="modal-title text-white">
                  <i className="bi bi-play-circle-fill text-danger me-2"></i>
                  {movie.title} - Official Trailer
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowTrailerModal(false)}
                ></button>
              </div>
              <div className="modal-body text-center p-4">
                <div className="ratio ratio-16x9">
                  <iframe
                    src="https://www.youtube.com/embed/GY4BgdUSpbE"
                    title="Movie Trailer"
                    allowFullScreen
                    style={{ borderRadius: '8px' }}
                  ></iframe>
                </div>
                <p className="small text-secondary mt-3 mb-0">
                  Trailer provided for demo presentation.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

