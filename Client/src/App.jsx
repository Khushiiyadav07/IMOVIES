import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { MovieProvider } from './context/MovieContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MoviesPage from './pages/MoviesPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import BookingsPage from './pages/BookingsPage';
import WatchlistPage from './pages/WatchlistPage';

// Admin Pages matching Screenshots
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAddMovie from './pages/admin/AdminAddMovie';
import AdminAddTheatre from './pages/admin/AdminAddTheatre';
import AdminAddShow from './pages/admin/AdminAddShow';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MovieProvider>
          <BrowserRouter>
            <div className="app-container">
              <Navbar />
              <main className="main-content">
                <Routes>
                  {/* Public & Customer Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/movies" element={<MoviesPage />} />
                  <Route path="/movie/:id" element={<MovieDetailsPage />} />
                  <Route path="/watchlist" element={<WatchlistPage />} />

                  {/* Authenticated Customer Routes */}
                  <Route
                    path="/seat-selection/:showId"
                    element={
                      <ProtectedRoute>
                        <SeatSelectionPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/bookings"
                    element={
                      <ProtectedRoute>
                        <BookingsPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Routes with multiple aliases for seamless navigation */}
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin-dashboard" element={<AdminDashboard />} />
                  <Route path="/dashboard" element={<AdminDashboard />} />

                  {/* Add Movie Routes (Screenshot 5) */}
                  <Route path="/admin/add-movie" element={<AdminAddMovie />} />
                  <Route path="/add-movie" element={<AdminAddMovie />} />
                  <Route path="/addmovie" element={<AdminAddMovie />} />

                  {/* Add Show Routes (Screenshot 7 & User Upload) */}
                  <Route path="/admin/add-show" element={<AdminAddShow />} />
                  <Route path="/add-show" element={<AdminAddShow />} />
                  <Route path="/addshow" element={<AdminAddShow />} />

                  {/* Add Theatre Routes (Screenshot 8 & User Upload) */}
                  <Route path="/admin/add-theatre" element={<AdminAddTheatre />} />
                  <Route path="/admin/add-theater" element={<AdminAddTheatre />} />
                  <Route path="/add-theatre" element={<AdminAddTheatre />} />
                  <Route path="/add-theater" element={<AdminAddTheatre />} />
                  <Route path="/addtheatre" element={<AdminAddTheatre />} />
                  <Route path="/addtheater" element={<AdminAddTheatre />} />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </MovieProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
