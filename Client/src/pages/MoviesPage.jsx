import React, { useState, useMemo } from 'react';
import { useMovies } from '../context/MovieContext';
import MovieCard from '../components/MovieCard';

export default function MoviesPage() {
  const { movies, searchQuery } = useMovies();
  const [selectedGenre, setSelectedGenre] = useState('All');

  const genres = ['All', 'Action', 'Drama', 'Thriller', 'Historical', 'Comedy', 'Sci-Fi'];

  // Filter movies by search query and genre
  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.genres.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesGenre =
        selectedGenre === 'All' ||
        movie.genres.toLowerCase().includes(selectedGenre.toLowerCase());

      return matchesSearch && matchesGenre;
    });
  }, [movies, searchQuery, selectedGenre]);

  return (
    <div className="container-fluid px-3 px-md-4 py-3">
      {/* Red Banner Bar matching Screenshot 6 */}
      <div className="available-movies-bar">
        Available Movies
      </div>

      {/* Genre Filter Chips */}
      <div className="d-flex flex-wrap align-items-center justify-content-center gap-2 mb-4">
        {genres.map((genre) => (
          <button
            key={genre}
            className={`filter-chip ${selectedGenre === genre ? 'active' : ''}`}
            onClick={() => setSelectedGenre(genre)}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Search status indicator */}
      {searchQuery && (
        <div className="text-center mb-3 text-secondary small">
          Showing results for <span className="text-white">"{searchQuery}"</span> &bull;{' '}
          <button
            className="btn btn-link text-danger p-0 text-decoration-none small"
            onClick={() => setSelectedGenre('All')}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Movies Grid matching Screenshot 6 & 9 */}
      {filteredMovies.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-film text-secondary display-3 mb-3 d-block"></i>
          <h4 className="fw-semibold">No movies found</h4>
          <p className="text-secondary">Try searching with a different title or select "All" genres.</p>
        </div>
      ) : (
        <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 row-cols-xl-6 g-3 g-md-4">
          {filteredMovies.map((movie) => (
            <div key={movie.id} className="col">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

