import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMovies } from '../../context/MovieContext';

export default function AdminAddMovie() {
  const navigate = useNavigate();
  const { addMovie } = useMovies();

  const [movieName, setMovieName] = useState('');
  const [genres, setGenres] = useState('');
  const [runtime, setRuntime] = useState('');
  const [trailerUrl, setTrailerUrl] = useState('');
  const [description, setDescription] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [certification, setCertification] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!movieName || !description) {
      alert('Please fill in Movie Name and Description.');
      return;
    }

    const formattedDate = releaseDate
      ? new Date(releaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : 'Coming Soon';

    addMovie({
      title: movieName,
      description,
      genres: genres || 'Action, Drama',
      runtime: runtime ? `${runtime} min` : '150 min',
      trailerUrl: trailerUrl || 'https://www.youtube.com',
      releaseDate: formattedDate,
      certification: certification || 'U/A',
      poster: posterUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60',
      rating: 4.8
    });

    setMessage('Movie added successfully! Redirecting...');
    setTimeout(() => {
      navigate('/movies');
    }, 1000);
  };

  return (
    <div className="container py-4">
      <div className="mx-auto" style={{ maxWidth: '850px' }}>
        {/* Poster preview box with red dashed border matching Screenshot 5 */}
        <div
          className="poster-upload-preview mb-4 text-center"
          onClick={() => {
            const url = prompt('Enter or paste image poster URL:', posterUrl);
            if (url) setPosterUrl(url);
          }}
          title="Click to set Poster Image URL"
        >
          {posterUrl ? (
            <img src={posterUrl} alt="Poster preview" />
          ) : (
            <div className="p-3">
              <i className="bi bi-plus-circle text-danger fs-1 d-block mb-2"></i>
              <span className="small text-secondary">
                Click here to set Movie Poster Image URL
              </span>
            </div>
          )}
        </div>

        {/* Header: "Add Movie" matching Screenshot 5 */}
        <h3 className="text-center fw-bold mb-4" style={{ color: 'var(--im-primary)' }}>
          Add Movie
        </h3>

        {message && (
          <div className="alert alert-success py-2 text-center" role="alert">
            <i className="bi bi-check-circle-fill me-2"></i>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* 2-Column form matching Screenshot 5 */}
          <div className="row g-3 mb-4">
            {/* Left Column */}
            <div className="col-md-6">
              <div className="im-form-group">
                <label className="im-form-label">Movie</label>
                <input
                  type="text"
                  className="im-form-control"
                  placeholder="Enter movie name"
                  value={movieName}
                  onChange={(e) => setMovieName(e.target.value)}
                  required
                />
              </div>

              <div className="im-form-group">
                <label className="im-form-label">Genres</label>
                <input
                  type="text"
                  className="im-form-control"
                  placeholder="Enter movie genres eg. Action, Drama"
                  value={genres}
                  onChange={(e) => setGenres(e.target.value)}
                  required
                />
              </div>

              <div className="im-form-group">
                <label className="im-form-label">Runtime</label>
                <input
                  type="number"
                  className="im-form-control"
                  placeholder="Enter runtime in minutes"
                  value={runtime}
                  onChange={(e) => setRuntime(e.target.value)}
                  required
                />
              </div>

              <div className="im-form-group">
                <label className="im-form-label">Trailer URL (YouTube)</label>
                <input
                  type="url"
                  className="im-form-control"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={trailerUrl}
                  onChange={(e) => setTrailerUrl(e.target.value)}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="col-md-6">
              <div className="im-form-group">
                <label className="im-form-label">Description</label>
                <input
                  type="text"
                  className="im-form-control"
                  placeholder="Enter movie description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="im-form-group">
                <label className="im-form-label">Release Date</label>
                <input
                  type="date"
                  className="im-form-control"
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                  required
                />
              </div>

              <div className="im-form-group">
                <label className="im-form-label">Certification</label>
                <input
                  type="text"
                  className="im-form-control"
                  placeholder="Enter movie certification (e.g. U/A, A, U)"
                  value={certification}
                  onChange={(e) => setCertification(e.target.value)}
                  required
                />
              </div>

              <div className="im-form-group">
                <label className="im-form-label">Poster Image URL</label>
                <input
                  type="url"
                  className="im-form-control"
                  placeholder="https://example.com/poster.jpg"
                  value={posterUrl}
                  onChange={(e) => setPosterUrl(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Submit Button matching Screenshot 5 */}
          <div className="text-center">
            <button type="submit" className="btn-cinema-red px-5 py-2">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

