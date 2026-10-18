import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialMovies, initialTheatres, initialShows, initialBookings } from '../data/initialData';
import { api } from '../api/apiClient';

const MovieContext = createContext();

export function MovieProvider({ children }) {
  // Load saved state or fall back to initial screenshots data
  const [movies, setMovies] = useState(() => {
    const saved = localStorage.getItem('imovies_movies');
    return saved ? JSON.parse(saved) : initialMovies;
  });

  const [theatres, setTheatres] = useState(() => {
    const saved = localStorage.getItem('imovies_theatres');
    return saved ? JSON.parse(saved) : initialTheatres;
  });

  const [shows, setShows] = useState(() => {
    const saved = localStorage.getItem('imovies_shows');
    return saved ? JSON.parse(saved) : initialShows;
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('imovies_bookings');
    return saved ? JSON.parse(saved) : initialBookings;
  });

  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('imovies_watchlist');
    return saved ? JSON.parse(saved) : ['m1', 'm3'];
  });

  const [searchQuery, setSearchQuery] = useState('');

  // Fetch live data from Backend API on mount
  useEffect(() => {
    const loadBackendData = async () => {
      try {
        // 1. Fetch movies
        const movieRes = await api.getMovies();
        if (movieRes && movieRes.success && movieRes.movies?.length > 0) {
          const formattedMovies = movieRes.movies.map((m) => ({
            ...m,
            id: m._id || m.id
          }));
          setMovies(formattedMovies);
        }

        // 2. Fetch theatres
        const theatreRes = await api.getTheatres();
        if (theatreRes && theatreRes.success && theatreRes.theatres?.length > 0) {
          const formattedTheatres = theatreRes.theatres.map((t) => ({
            ...t,
            id: t._id || t.id
          }));
          setTheatres(formattedTheatres);
        }

        // 3. Fetch shows
        const showRes = await api.getShows();
        if (showRes && showRes.success && showRes.shows?.length > 0) {
          const formattedShows = showRes.shows.map((s) => ({
            ...s,
            id: s._id || s.id
          }));
          setShows(formattedShows);
        }

        // 4. Fetch bookings
        const bookingRes = await api.getBookings();
        if (bookingRes && bookingRes.success && bookingRes.bookings?.length > 0) {
          const formattedBookings = bookingRes.bookings.map((b) => ({
            ...b,
            id: b._id || b.id
          }));
          setBookings(formattedBookings);
        }
      } catch (err) {
        console.log("Backend offline or loading; using local persistent cinema data.");
      }
    };

    loadBackendData();
  }, []);

  // Persist locally as cache
  useEffect(() => {
    localStorage.setItem('imovies_movies', JSON.stringify(movies));
  }, [movies]);

  useEffect(() => {
    localStorage.setItem('imovies_theatres', JSON.stringify(theatres));
  }, [theatres]);

  useEffect(() => {
    localStorage.setItem('imovies_shows', JSON.stringify(shows));
  }, [shows]);

  useEffect(() => {
    localStorage.setItem('imovies_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('imovies_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // Actions
  const addMovie = async (newMovie) => {
    const tempId = 'm_' + Date.now();
    const movieWithId = {
      ...newMovie,
      id: tempId,
      rating: newMovie.rating || 4.5
    };
    setMovies(prev => [movieWithId, ...prev]);

    // Send to Backend API
    try {
      const res = await api.addMovie(newMovie);
      if (res && res.success && res.movie) {
        setMovies(prev => prev.map(m => m.id === tempId ? { ...res.movie, id: res.movie._id } : m));
      }
    } catch (e) {
      console.log("Movie saved locally (backend sync queued)");
    }

    return movieWithId;
  };

  const deleteMovie = async (movieId) => {
    setMovies(prev => prev.filter(m => m.id !== movieId && m._id !== movieId));
    setShows(prev => prev.filter(s => s.movieId !== movieId));

    try {
      await api.deleteMovie(movieId);
    } catch (e) {
      console.log("Deleted movie locally");
    }
  };

  const addTheatre = async (newTheatre) => {
    const tempId = 'th_' + Date.now();
    const theatreWithId = {
      ...newTheatre,
      id: tempId
    };
    setTheatres(prev => [...prev, theatreWithId]);

    try {
      const res = await api.addTheatre(newTheatre);
      if (res && res.success && res.theatre) {
        setTheatres(prev => prev.map(t => t.id === tempId ? { ...res.theatre, id: res.theatre._id } : t));
      }
    } catch (e) {
      console.log("Theatre saved locally");
    }

    return theatreWithId;
  };

  const addShow = async (newShow) => {
    const movie = movies.find(m => m.id === newShow.movieId || m._id === newShow.movieId);
    const theatre = theatres.find(t => t.id === newShow.theatreId || t._id === newShow.theatreId);
    const tempId = 's_' + Date.now();

    const showWithId = {
      ...newShow,
      id: tempId,
      movieTitle: movie ? movie.title : (newShow.movieTitle || 'Movie'),
      theatreName: theatre ? theatre.name : (newShow.theatreName || 'Theatre'),
      bookedSeats: []
    };
    setShows(prev => [showWithId, ...prev]);

    try {
      const res = await api.addShow({
        ...newShow,
        movieTitle: showWithId.movieTitle,
        theatreName: showWithId.theatreName
      });
      if (res && res.success && res.show) {
        setShows(prev => prev.map(s => s.id === tempId ? { ...res.show, id: res.show._id } : s));
      }
    } catch (e) {
      console.log("Show scheduled locally");
    }

    return showWithId;
  };

  const deleteShow = async (showId) => {
    setShows(prev => prev.filter(s => s.id !== showId && s._id !== showId));
    try {
      await api.deleteShow(showId);
    } catch (e) {
      console.log("Show deleted locally");
    }
  };

  const bookSeats = async (bookingData) => {
    const newBooking = {
      id: 'b_' + Date.now(),
      bookingId: 'IMV-' + Math.floor(10000 + Math.random() * 90000),
      bookingDate: new Date().toISOString(),
      status: 'Confirmed',
      ...bookingData
    };

    // Update show booked seats so seats become marked as booked immediately in UI
    if (bookingData.showId && bookingData.selectedSeatKeys) {
      setShows(prevShows =>
        prevShows.map(show => {
          if (show.id === bookingData.showId || show._id === bookingData.showId) {
            return {
              ...show,
              bookedSeats: [...(show.bookedSeats || []), ...bookingData.selectedSeatKeys]
            };
          }
          return show;
        })
      );
    }

    setBookings(prev => [newBooking, ...prev]);

    // Send to backend API
    try {
      const res = await api.createBooking(bookingData);
      if (res && res.success && res.booking) {
        setBookings(prev => prev.map(b => b.id === newBooking.id ? { ...res.booking, id: res.booking._id } : b));
      }
    } catch (e) {
      console.log("Booking saved locally");
    }

    return newBooking;
  };

  const cancelBooking = async (bookingId) => {
    setBookings(prev => prev.filter(b => b.id !== bookingId && b.bookingId !== bookingId && b._id !== bookingId));
    try {
      await api.cancelBooking(bookingId);
    } catch (e) {
      console.log("Booking cancelled locally");
    }
  };

  const toggleWatchlist = async (movieId) => {
    const isAdding = !watchlist.includes(movieId);
    setWatchlist(prev => {
      if (prev.includes(movieId)) {
        return prev.filter(id => id !== movieId);
      } else {
        return [...prev, movieId];
      }
    });

    try {
      if (isAdding) {
        await api.addFavorite({ movieId });
      } else {
        await api.removeFavorite(movieId, 'gvdkumar@gmail.com');
      }
    } catch (e) {
      // quiet
    }
  };

  const isMovieInWatchlist = (movieId) => watchlist.includes(movieId);

  return (
    <MovieContext.Provider
      value={{
        movies,
        theatres,
        shows,
        bookings,
        watchlist,
        searchQuery,
        setSearchQuery,
        addMovie,
        deleteMovie,
        addTheatre,
        addShow,
        deleteShow,
        bookSeats,
        cancelBooking,
        toggleWatchlist,
        isMovieInWatchlist
      }}
    >
      {children}
    </MovieContext.Provider>
  );
}

export function useMovies() {
  return useContext(MovieContext);
}
