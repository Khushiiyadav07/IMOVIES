import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="py-4 mt-auto border-top" style={{ borderColor: 'var(--im-border-color)', backgroundColor: 'var(--im-nav-bg)' }}>
      <div className="container text-center">
        <div className="mb-2">
          <Link to="/" className="brand-logo justify-content-center text-decoration-none">
            <span className="brand-i">i</span>
            <span className="brand-movies">Movies</span>
          </Link>
        </div>
        <p className="text-secondary small mb-1">
          Designed & Developed by Khushi Yadav
        </p>
        <p className="text-secondary small mb-0">
          &copy; 2026 iMovies. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

