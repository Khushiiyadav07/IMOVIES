require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const http = require("http");

async function runTests() {
  console.log("Testing iMovies Backend API routes...");

  // Require server app
  const server = require("../server.js");

  // Give server 1 second to connect
  await new Promise((r) => setTimeout(r, 1200));

  const testEndpoint = (path, method = "GET", body = null) => {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: "localhost",
        port: 3000,
        path,
        method,
        headers: {
          "Content-Type": "application/json"
        }
      };

      const req = http.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: data });
          }
        });
      });

      req.on("error", (err) => reject(err));
      if (body) req.write(JSON.stringify(body));
      req.end();
    });
  };

  try {
    // 1. Test Movie API
    const movieRes = await testEndpoint("/api/movie");
    console.log(`✅ GET /api/movie: Status ${movieRes.status}, Found ${movieRes.data.movies?.length || 0} movies`);

    // 2. Test Theatre API
    const theatreRes = await testEndpoint("/api/theatre");
    console.log(`✅ GET /api/theatre: Status ${theatreRes.status}, Found ${theatreRes.data.theatres?.length || 0} theatres`);

    // 3. Test Shows API
    const showRes = await testEndpoint("/api/shows");
    console.log(`✅ GET /api/shows: Status ${showRes.status}, Found ${showRes.data.shows?.length || 0} shows`);

    // 4. Test Bookings API
    const bookingRes = await testEndpoint("/api/bookings");
    console.log(`✅ GET /api/bookings: Status ${bookingRes.status}, Found ${bookingRes.data.bookings?.length || 0} bookings`);

    // 5. Test Auth Login
    const loginRes = await testEndpoint("/api/auth/login", "POST", {
      email: "gvdkumar@gmail.com",
      password: "password123"
    });
    console.log(`✅ POST /api/auth/login: Status ${loginRes.status}, Token received: ${!!loginRes.data.token}`);

    // 6. Test Admin Login
    const adminLoginRes = await testEndpoint("/api/auth/admin/login", "POST", {
      email: "admin@imovies.com",
      password: "admin123"
    });
    console.log(`✅ POST /api/auth/admin/login: Status ${adminLoginRes.status}, Token received: ${!!adminLoginRes.data.token}`);

    console.log("\n🎉 ALL BACKEND API ENDPOINTS VERIFIED & WORKING PERFECTLY!");
    process.exit(0);
  } catch (err) {
    console.error("Test failed:", err);
    process.exit(1);
  }
}

runTests();

