import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAdminRegister, setIsAdminRegister] = useState(false);
  const [adminSecret, setAdminSecret] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password should be at least 6 characters.');
      return;
    }

    if (isAdminRegister && adminSecret !== 'admin123') {
      setError('Invalid Admin Security Key. (Hint: use admin123)');
      return;
    }

    setLoading(true);
    try {
      const role = isAdminRegister ? 'admin' : 'user';
      const result = await register(username, email, password, role);
      if (result.success) {
        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/movies');
        }
      }
    } catch (err) {
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Logo matching Screenshot 2 */}
        <div className="brand-title">
          <span className="brand-i">i</span>
          <span className="brand-movies">Movies</span>
        </div>
        <div className="auth-subtitle">
          {isAdminRegister ? 'Register as Admin' : 'Register'}
        </div>

        {error && (
          <div className="alert alert-danger py-2 text-sm" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="im-form-group">
            <label className="im-form-label">Username</label>
            <input
              type="text"
              className="im-form-control"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Email */}
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

          {/* Password */}
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

          {/* Confirm Password */}
          <div className="im-form-group">
            <label className="im-form-label">Confirm Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              className="im-form-control"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* Admin Security Key if registering as Admin */}
          {isAdminRegister && (
            <div className="im-form-group">
              <label className="im-form-label text-warning">
                <i className="bi bi-key-fill me-1"></i> Admin Security Key
              </label>
              <input
                type="password"
                className="im-form-control border-warning"
                placeholder="Enter admin security key (use: admin123)"
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
                required
              />
            </div>
          )}

          {/* Show Password checkbox */}
          <div className="form-check mb-4">
            <input
              className="form-check-input"
              type="checkbox"
              id="showRegisterPassword"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              style={{ backgroundColor: 'var(--im-bg-input)', borderColor: 'var(--im-border-color)' }}
            />
            <label className="form-check-label text-secondary small ms-1" htmlFor="showRegisterPassword">
              Show Password
            </label>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn-cinema-red w-100 mb-3" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>

        {/* Already have an account link */}
        <div className="text-center small mb-2">
          <span className="text-secondary">Already have an account? </span>
          <Link to="/login" className="text-danger text-decoration-none fw-semibold">
            Login
          </Link>
        </div>

        {/* Register as Admin toggle button matching Screenshot 2 */}
        <div className="text-center small mt-3">
          <button
            type="button"
            className="btn btn-link text-decoration-none text-secondary p-0"
            onClick={() => setIsAdminRegister(!isAdminRegister)}
          >
            {isAdminRegister ? (
              <span>&larr; Switch back to <strong className="text-danger">User Register</strong></span>
            ) : (
              <span>Register as an <strong className="text-danger">Admin</strong></span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

