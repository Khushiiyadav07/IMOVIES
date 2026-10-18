import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMovies } from '../../context/MovieContext';

export default function AdminAddTheatre() {
  const navigate = useNavigate();
  const { addTheatre } = useMovies();

  const [theatreName, setTheatreName] = useState('');
  const [theatreLocation, setTheatreLocation] = useState('');
  const [balconyPrice, setBalconyPrice] = useState(0);
  const [balconySeats, setBalconySeats] = useState(0);
  const [middlePrice, setMiddlePrice] = useState(0);
  const [middleSeats, setMiddleSeats] = useState(0);
  const [lowerPrice, setLowerPrice] = useState(0);
  const [lowerSeats, setLowerSeats] = useState(0);
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!theatreName || !theatreLocation) {
      alert('Please fill in Theatre Name and Location.');
      return;
    }

    addTheatre({
      name: theatreName,
      location: theatreLocation,
      balconyPrice: Number(balconyPrice) || 175,
      balconySeats: Number(balconySeats) || 50,
      middlePrice: Number(middlePrice) || 130,
      middleSeats: Number(middleSeats) || 120,
      lowerPrice: Number(lowerPrice) || 100,
      lowerSeats: Number(lowerSeats) || 80
    });

    setMessage('Theatre added successfully! Redirecting...');
    setTimeout(() => {
      navigate('/admin/add-show');
    }, 1000);
  };

  return (
    <div className="im-admin-wrapper">
      {/* Title matching Screenshot: "Add Theatre" with Theatre in red */}
      <h2 className="fw-bold mb-4 text-center">
        Add <span style={{ color: 'var(--im-primary)' }}>Theatre</span>
      </h2>

      <div className="im-admin-form-card">
        {message && (
          <div className="alert alert-success py-2 text-center small mb-3" role="alert">
            <i className="bi bi-check-circle-fill me-2"></i>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Theatre Name */}
          <div className="im-form-group mb-3">
            <label className="im-form-label">Theatre Name</label>
            <input
              type="text"
              className="im-form-control"
              placeholder=""
              value={theatreName}
              onChange={(e) => setTheatreName(e.target.value)}
              required
            />
          </div>

          {/* Theatre Location */}
          <div className="im-form-group mb-3">
            <label className="im-form-label">Theatre Location</label>
            <input
              type="text"
              className="im-form-control"
              placeholder=""
              value={theatreLocation}
              onChange={(e) => setTheatreLocation(e.target.value)}
              required
            />
          </div>

          {/* Balcony Row */}
          <div className="row g-3 mb-3">
            <div className="col-6">
              <label className="im-form-label">Balcony Seat Price</label>
              <input
                type="number"
                className="im-form-control"
                value={balconyPrice}
                onChange={(e) => setBalconyPrice(e.target.value)}
                required
              />
            </div>
            <div className="col-6">
              <label className="im-form-label">Balcony Seat Count</label>
              <input
                type="number"
                className="im-form-control"
                value={balconySeats}
                onChange={(e) => setBalconySeats(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Middle Row */}
          <div className="row g-3 mb-3">
            <div className="col-6">
              <label className="im-form-label">Middle Seat Price</label>
              <input
                type="number"
                className="im-form-control"
                value={middlePrice}
                onChange={(e) => setMiddlePrice(e.target.value)}
                required
              />
            </div>
            <div className="col-6">
              <label className="im-form-label">Middle Seat Count</label>
              <input
                type="number"
                className="im-form-control"
                value={middleSeats}
                onChange={(e) => setMiddleSeats(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Lower Row */}
          <div className="row g-3 mb-4">
            <div className="col-6">
              <label className="im-form-label">Lower Seat Price</label>
              <input
                type="number"
                className="im-form-control"
                value={lowerPrice}
                onChange={(e) => setLowerPrice(e.target.value)}
                required
              />
            </div>
            <div className="col-6">
              <label className="im-form-label">Lower Seat Count</label>
              <input
                type="number"
                className="im-form-control"
                value={lowerSeats}
                onChange={(e) => setLowerSeats(e.target.value)}
                required
              />
            </div>
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
