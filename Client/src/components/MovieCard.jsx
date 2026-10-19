import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMovies } from '../context/MovieContext';
import { getPosterUrl } from '../utils/imageUtils';

export default function MovieCard({ movie }) {
  const navigate = useNavigate();
  const { isMovieInWatchlist, toggleWatchlist } = useMovies();
  const inWatchlist = isMovieInWatchlist(movie.id);

  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  const handleWatchlistClick = (e) => {
    e.stopPropagation();
    toggleWatchlist(movie.id);
  };

  return (
    <div className="movie-card cursor-pointer" onClick={handleCardClick} role="button">
      <div className="movie-poster-wrap">
        <img
          src={getPosterUrl(movie.poster)}
          alt={movie.title}
          loading="lazy"
          onError={(e) => {
            // High quality fallback cinema poster
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60";
          }}
        />
        {/* Watchlist Floating Heart Icon Button */}
        <button
          className={`movie-watchlist-btn ${inWatchlist ? 'active' : ''}`}
          onClick={handleWatchlistClick}
          title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
        >
          <i className={inWatchlist ? "bi bi-heart-fill text-danger" : "bi bi-heart"}></i>
        </button>
      </div>

      <div className="movie-card-body">
        <h6 className="movie-card-title text-capitalize" title={movie.title}>
          {movie.title}
        </h6>
        <div className="movie-card-date">
          <i className="bi bi-calendar3 text-danger"></i>
          <span>{movie.releaseDate}</span>
        </div>
        <div className="movie-card-genres" title={movie.genres}>
          {movie.genres}
        </div>
      </div>
    </div>
  );
}

