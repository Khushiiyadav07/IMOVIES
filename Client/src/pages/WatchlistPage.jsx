import React from 'react';
import { Link } from 'react-router-dom';
import { useMovies } from '../context/MovieContext';
import MovieCard from '../components/MovieCard';

export default function WatchlistPage() {
  const { movies, watchlist } = useMovies();

  const watchlistMovies = movies.filter((m) => watchlist.includes(m.id));

  return (
    <div className="container py-4">
      <h2 className="text-center fw-bold mb-4">
        Your <span style={{ color: 'var(--im-primary)' }}>Watchlist</span>
      </h2>

      {watchlistMovies.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-heartbreak text-secondary display-3 mb-3 d-block"></i>
          <h4 className="fw-semibold">Your watchlist is empty</h4>
          <p className="text-secondary">Click the heart icon on any movie card to save it here.</p>
          <Link to="/movies" className="btn-cinema-red mt-2">
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 row-cols-xl-6 g-3 g-md-4">
          {watchlistMovies.map((movie) => (
            <div key={movie.id} className="col">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

