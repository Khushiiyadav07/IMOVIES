// API Client connecting Frontend to Express / MongoDB Backend

const API_BASE = "http://localhost:3000/api";

const getHeaders = () => {
  const token = localStorage.getItem("imovies_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { "auth-token": token, Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // Auth
  login: async (email, password) => {
    const isDoctorAdmin = email.toLowerCase().includes("admin");
    const endpoint = isDoctorAdmin ? `${API_BASE}/auth/admin/login` : `${API_BASE}/auth/login`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  register: async (username, email, password, role = "user", adminSecret = "") => {
    const isAdmin = role === "admin";
    const endpoint = isAdmin ? `${API_BASE}/auth/admin/register` : `${API_BASE}/auth/register`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ username, email, password, role, adminSecret })
    });
    return res.json();
  },

  // Movies
  getMovies: async (search = "", genre = "") => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (genre && genre !== "All") params.append("genre", genre);
    const res = await fetch(`${API_BASE}/movie?${params.toString()}`);
    return res.json();
  },

  addMovie: async (movieData) => {
    const res = await fetch(`${API_BASE}/movie/add`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(movieData)
    });
    return res.json();
  },

  deleteMovie: async (id) => {
    const res = await fetch(`${API_BASE}/movie/${id}`, {
      method: "DELETE",
      headers: getHeaders()
    });
    return res.json();
  },

  // Theatres
  getTheatres: async () => {
    const res = await fetch(`${API_BASE}/theatre/all`);
    return res.json();
  },

  addTheatre: async (theatreData) => {
    const res = await fetch(`${API_BASE}/theatre/add`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(theatreData)
    });
    return res.json();
  },

  deleteTheatre: async (id) => {
    const res = await fetch(`${API_BASE}/theatre/${id}`, {
      method: "DELETE",
      headers: getHeaders()
    });
    return res.json();
  },

  // Shows
  getShows: async () => {
    const res = await fetch(`${API_BASE}/shows/all`);
    return res.json();
  },

  getShowsByMovie: async (movieId) => {
    const res = await fetch(`${API_BASE}/shows/movie/${movieId}`);
    return res.json();
  },

  addShow: async (showData) => {
    const res = await fetch(`${API_BASE}/shows/add`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(showData)
    });
    return res.json();
  },

  deleteShow: async (id) => {
    const res = await fetch(`${API_BASE}/shows/${id}`, {
      method: "DELETE",
      headers: getHeaders()
    });
    return res.json();
  },

  // Bookings
  getBookings: async (email = "") => {
    const endpoint = email ? `${API_BASE}/bookings?email=${encodeURIComponent(email)}` : `${API_BASE}/bookings/all`;
    const res = await fetch(endpoint, { headers: getHeaders() });
    return res.json();
  },

  createBooking: async (bookingData) => {
    const res = await fetch(`${API_BASE}/bookings/create`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(bookingData)
    });
    return res.json();
  },

  cancelBooking: async (bookingId) => {
    const res = await fetch(`${API_BASE}/bookings/cancel/${bookingId}`, {
      method: "DELETE",
      headers: getHeaders()
    });
    return res.json();
  },

  // Favorites / Watchlist
  getFavorites: async (email) => {
    const res = await fetch(`${API_BASE}/favorite?email=${encodeURIComponent(email)}`, {
      headers: getHeaders()
    });
    return res.json();
  },

  addFavorite: async (data) => {
    const res = await fetch(`${API_BASE}/favorite/add`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  removeFavorite: async (movieId, email) => {
    const res = await fetch(`${API_BASE}/favorite/remove/${movieId}?email=${encodeURIComponent(email)}`, {
      method: "DELETE",
      headers: getHeaders()
    });
    return res.json();
  },

  // Reviews
  getReviews: async (movieId) => {
    const res = await fetch(`${API_BASE}/review/${movieId}`);
    return res.json();
  },

  addReview: async (reviewData) => {
    const res = await fetch(`${API_BASE}/review/add`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(reviewData)
    });
    return res.json();
  }
};

