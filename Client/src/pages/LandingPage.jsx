import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPosterUrl } from '../utils/imageUtils';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center px-4 px-md-5" style={{ background: 'radial-gradient(circle at 80% 30%, rgba(229, 9, 20, 0.08), transparent 50%), var(--im-bg-main)' }}>
      <div className="row w-100 align-items-center">
        {/* Left Column matching Screenshot 1 */}
        <div className="col-lg-7 col-md-9 py-5">
          <h1 className="display-3 fw-bold mb-3" style={{ letterSpacing: '-1px' }}>
            Welcome to <span style={{ color: 'var(--im-primary)' }}>iMovies</span>
          </h1>
          <p className="lead text-secondary mb-4 col-lg-10" style={{ fontSize: '1.25rem', lineHeight: '1.6' }}>
            Your ultimate destination for the latest blockbusters and timeless classics
          </p>

          <div className="d-flex flex-wrap align-items-center gap-3">
            {user ? (
              <Link to="/movies" className="btn-cinema-red px-4 py-2 fs-5">
                <i className="bi bi-film me-2"></i> Browse Movies
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn-cinema-red px-4 py-2">
                  Sign In
                </Link>
                <Link to="/register" className="btn-cinema-outline px-4 py-2">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Right decorative cinema poster collage/ambient glow */}
        <div className="col-lg-5 d-none d-lg-block text-center position-relative">
          <div
            style={{
              position: 'absolute',
              width: '380px',
              height: '380px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(229, 9, 20, 0.2) 0%, transparent 70%)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              filter: 'blur(40px)',
              pointerEvents: 'none'
            }}
          />
          <div className="p-4" style={{ transform: 'rotate(-4deg)' }}>
            <img
              src={getPosterUrl('/images/rrr_poster.jpg')}
              alt="iMovies Spotlight"
              className="img-fluid rounded-4 shadow-lg border"
              style={{ maxHeight: '440px', borderColor: 'rgba(229, 9, 20, 0.3)' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://image.tmdb.org/t/p/w500/wE0noIQUSNaqqaG014902bB8fl8.jpg";
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

