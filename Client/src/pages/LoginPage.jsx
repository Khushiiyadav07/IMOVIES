import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        if (result.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/movies');
        }
      }
    } catch (err) {
      setError('Invalid login credentials');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo fill buttons for easy grading & testing
  const fillDemo = (role) => {
    if (role === 'admin') {
      setEmail('admin@imovies.com');
      setPassword('admin123');
    } else {
      setEmail('gvdkumar@gmail.com');
      setPassword('password123');
    }
    setError('');
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Logo matching Screenshot 3 */}
        <div className="brand-title">
          <span className="brand-i">i</span>
          <span className="brand-movies">Movies</span>
        </div>
        <div className="auth-subtitle">Login</div>

        {error && (
          <div className="alert alert-danger py-2 text-sm" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email field */}
          <div className="im-form-group">
            <label className="im-form-label">Email</label>
            <input
              type="email"
              className="im-form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password field */}
          <div className="im-form-group">
            <label className="im-form-label">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              className="im-form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Show Password checkbox */}
          <div className="form-check mb-4">
            <input
              className="form-check-input"
              type="checkbox"
              id="showPasswordCheck"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              style={{ backgroundColor: 'var(--im-bg-input)', borderColor: 'var(--im-border-color)' }}
            />
            <label className="form-check-label text-secondary small ms-1" htmlFor="showPasswordCheck">
              Show Password
            </label>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn-cinema-red w-100 mb-3" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>

        {/* Register link matching Screenshot 3 */}
        <div className="text-center small mt-3">
          <span className="text-secondary">Create an account? </span>
          <Link to="/register" className="text-danger text-decoration-none fw-semibold">
            Register
          </Link>
        </div>

        {/* Demo Fast Logins */}
        <div className="border-top pt-3 mt-4 text-center" style={{ borderColor: 'var(--im-border-color)' }}>
          <span className="text-secondary small d-block mb-2">Demo 1-Click Fill:</span>
          <div className="d-flex justify-content-center gap-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary py-1 px-2"
              onClick={() => fillDemo('user')}
            >
              <i className="bi bi-person me-1"></i> User
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-danger py-1 px-2"
              onClick={() => fillDemo('admin')}
            >
              <i className="bi bi-shield-lock me-1"></i> Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

