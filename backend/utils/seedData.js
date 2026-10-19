require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/userModel");
const Admin = require("../models/adminModel");
const Movie = require("../models/movieModel");
const Theatre = require("../models/theatreModel");
const Show = require("../models/showModel");
const Booking = require("../models/bookingModel");

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/imovies";

const seedDatabase = async () => {
  try {
    console.log("Connecting to MongoDB for seeding...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB.");

    // 1. Seed Demo User
    const userPassword = await bcrypt.hash("password123", 10);
    await User.deleteMany({});
    const user = await User.create({
      username: "gvdkumar",
      email: "gvdkumar@gmail.com",
      password: userPassword,
      role: "user"
    });
    console.log("Seeded User: gvdkumar@gmail.com / password123");

    // 2. Seed Demo Admin
    const adminPassword = await bcrypt.hash("admin123", 10);
    await Admin.deleteMany({});
    const admin = await Admin.create({
      username: "Admin",
      email: "admin@imovies.com",
      password: adminPassword,
      role: "admin"
    });
    console.log("Seeded Admin: admin@imovies.com / admin123");

    // 3. Seed Movies matching screenshots
    await Movie.deleteMany({});
    const movies = await Movie.insertMany([
      {
        title: "Rrr",
        description: "A fearless warrior on a perilous mission comes face to face with a steely cop serving British forces in pre-independent India.",
        poster: `${import.meta.env.BASE_URL}images/rrr_poster.jpg`,
        backdrop: "https://image.tmdb.org/t/p/original/8hLp8oTfXJqHjE76aXy7JpY7hZk.jpg",
        genres: "Action, Drama, Historical",
        runtime: "182 min",
        releaseDate: "Mar 25, 2022",
        certification: "U/A",
        trailerUrl: "https://www.youtube.com/watch?v=GY4BgdUSpbE",
        rating: 4.8
      },
      {
        title: "Baahubali 2: the conclusion",
        description: "When Shiva, the son of Bahubali, learns about his heritage, he begins to look for answers. His story is juxtaposed with past events that unfolded in the Mahishmati Kingdom.",
         poster: `${import.meta.env.BASE_URL}images/Bahubali-2_poster.jpg`,
        backdrop: "https://image.tmdb.org/t/p/original/m99FmQYy3h8tS0M0JqZ3D7t9b5F.jpg",
        genres: "Action, Fantasy, Historical",
        runtime: "167 min",
        releaseDate: "Apr 28, 2017",
        certification: "U/A",
        trailerUrl: "https://www.youtube.com/watch?v=qD-6d8Wo3do",
        rating: 4.9
      },
      {
        title: "Og",
        description: "A ruthless gangster named Ojas Gambheera returns to Mumbai after a decade of disappearance to settle scores with rival mafia bosses.",
        poster: `${import.meta.env.BASE_URL}images/OG_poster.jpg`,
        backdrop: "https://image.tmdb.org/t/p/original/7c9JuqZ68aZ0p2r5x9s6Y5m8n1.jpg",
        genres: "Action, Crime, Thriller",
        runtime: "160 min",
        releaseDate: "Sep 25, 2025",
        certification: "A",
        trailerUrl: "https://www.youtube.com/watch?v=OgTeaserDemo",
        rating: 4.7
      },
      {
        title: "Rajasabb",
        description: "A romantic horror comedy following a man who inherits a mysterious ancestral royal estate, only to discover paranormal secrets.",
        poster: `${import.meta.env.BASE_URL}images/Rajasaab_poster.jpg`,
        backdrop: "https://image.tmdb.org/t/p/original/r0hZz4B3N0qK3X8l1P0m7Q5b1.jpg",
        genres: "Comedy, Horror, Romance",
        runtime: "155 min",
        releaseDate: "Dec 5, 2025",
        certification: "U/A",
        trailerUrl: "https://www.youtube.com/watch?v=RajaSaabTrailer",
        rating: 4.5
      },
      {
        title: "Toxic",
        description: "A fairy tale for grown-ups set in the dark criminal underworld with intense action sequences and high-stakes drama.",
        poster: `${import.meta.env.BASE_URL}images/toxic_poster.png`,
        backdrop: "https://image.tmdb.org/t/p/original/9r1B3k8q5x2m0o7p4y6n1t2.jpg",
        genres: "Action, Thriller",
        runtime: "150 min",
        releaseDate: "Oct 1, 2025",
        certification: "A",
        trailerUrl: "https://www.youtube.com/watch?v=ToxicTeaserDemo",
        rating: 4.6
      },
      {
        title: "Avatar: Fire and Ash",
        description: "Jake Sully and Neytiri encounter a hostile Na'vi clan known as the Ash People who inhabit the volcanic regions of Pandora.",
        poster: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
        backdrop: "https://image.tmdb.org/t/p/original/8rpDcsfLJypbO6vREc0547VKqEv.jpg",
        genres: "Action, Adventure, Sci-Fi",
        runtime: "190 min",
        releaseDate: "Sep 30, 2025",
        certification: "U/A",
        trailerUrl: "https://www.youtube.com/watch?v=d9MyW72ELq0",
        rating: 4.9
      },
      {
        title: "Bagheera",
        description: "When morality is threatened, a masked vigilante rises to protect the helpless and deliver relentless justice to criminals.",
        poster: `${import.meta.env.BASE_URL}images/Bagheera_poster.jpg`,
        backdrop: "https://image.tmdb.org/t/p/original/c2l0m8n1o2p3q4r5s6t7u8v9w0.jpg",
        genres: "Action, Crime, Drama",
        runtime: "158 min",
        releaseDate: "Oct 31, 2024",
        certification: "U/A",
        trailerUrl: "https://www.youtube.com/watch?v=BagheeraTrailer",
        rating: 4.4
      },
      {
        title: "The pride of bharat",
        description: "An epic biographical saga chronicling the valiant leadership, guerrilla warfare tactics, and founding of the Maratha Empire.",
        poster: `${import.meta.env.BASE_URL}images/The-pride-of-bharat_poster.jpg`,
        backdrop: "https://image.tmdb.org/t/p/original/p1q2r3s4t5u6v7w8x9y0z1a2.jpg",
        genres: "Historical, Action, Drama",
        runtime: "165 min",
        releaseDate: "Jan 2, 2026",
        certification: "U/A",
        trailerUrl: "https://www.youtube.com/watch?v=ShivajiTrailer",
        rating: 4.9
      }
    ]);
    console.log(`Seeded ${movies.length} Movies.`);

    // 4. Seed Theatres matching Screenshot 8 & 10
    await Theatre.deleteMany({});
    const theatres = await Theatre.insertMany([
      {
        name: "Srinivasa",
        location: "KPHB Colony, Hyderabad",
        balconyPrice: 175,
        balconySeats: 50,
        middlePrice: 130,
        middleSeats: 120,
        lowerPrice: 100,
        lowerSeats: 80
      },
      {
        name: "Gokul",
        location: "Erragadda, Hyderabad",
        balconyPrice: 200,
        balconySeats: 60,
        middlePrice: 150,
        middleSeats: 140,
        lowerPrice: 110,
        lowerSeats: 90
      },
      {
        name: "PVR Cinemas",
        location: "Forum Mall, Kukatpally",
        balconyPrice: 250,
        balconySeats: 70,
        middlePrice: 180,
        middleSeats: 150,
        lowerPrice: 130,
        lowerSeats: 100
      }
    ]);
    console.log(`Seeded ${theatres.length} Theatres.`);

    // 5. Seed Shows matching Screenshot 4
    await Show.deleteMany({});
    const shows = await Show.insertMany([
      {
        movieTitle: "Og",
        theatreName: "Srinivasa",
        showDate: "Sep 25, 2025",
        showTime: "2:00 PM",
        bookedSeats: ["M-261", "M-262", "B-142"]
      },
      {
        movieTitle: "Og",
        theatreName: "Srinivasa",
        showDate: "Sep 25, 2025",
        showTime: "4:00 PM",
        bookedSeats: []
      },
      {
        movieTitle: "Og",
        theatreName: "Srinivasa",
        showDate: "Sep 25, 2025",
        showTime: "9:00 PM",
        bookedSeats: []
      },
      {
        movieTitle: "Rrr",
        theatreName: "Gokul",
        showDate: "Nov 14, 2025",
        showTime: "2:00 PM",
        bookedSeats: []
      },
      {
        movieTitle: "Baahubali 2: the conclusion",
        theatreName: "Gokul",
        showDate: "Nov 14, 2025",
        showTime: "6:00 PM",
        bookedSeats: []
      },
      {
        movieTitle: "The pride of bharat",
        theatreName: "Gokul",
        showDate: "Jan 2, 2026",
        showTime: "9:30 PM",
        bookedSeats: ["B-198"]
      }
    ]);
    console.log(`Seeded ${shows.length} Shows.`);

    // 6. Seed Bookings matching Screenshot 10
    await Booking.deleteMany({});
    await Booking.insertMany([
      {
        bookingId: "IMV-83921",
        userEmail: "gvdkumar@gmail.com",
        movieTitle: "Og",
        moviePoster: "https://image.tmdb.org/t/p/w500/4q1JzL2d1n9o8l3pQ9gM1yZ9o1.jpg",
        theatreName: "Srinivasa",
        showDate: "Sep 25, 2025",
        showTime: "21:00",
        tierName: "Middle",
        seats: ["261", "262"],
        seatSummary: "Middle Seats: 261, 262",
        totalPrice: 260,
        status: "Confirmed",
        bookingDate: new Date()
      },
      {
        bookingId: "IMV-83922",
        userEmail: "gvdkumar@gmail.com",
        movieTitle: "Og",
        moviePoster: "https://image.tmdb.org/t/p/w500/4q1JzL2d1n9o8l3pQ9gM1yZ9o1.jpg",
        theatreName: "Srinivasa",
        showDate: "Sep 25, 2025",
        showTime: "21:00",
        tierName: "Balcony",
        seats: ["142"],
        seatSummary: "Balcony Seats: 142",
        totalPrice: 175,
        status: "Confirmed",
        bookingDate: new Date()
      },
      {
        bookingId: "IMV-91034",
        userEmail: "gvdkumar@gmail.com",
        movieTitle: "The pride of bharat",
        moviePoster: "https://image.tmdb.org/t/p/w500/m1n2o3p4q5r6s7t8u9v0w1x2.jpg",
        theatreName: "Gokul",
        showDate: "Jan 2, 2026",
        showTime: "21:30",
        tierName: "Balcony",
        seats: ["198"],
        seatSummary: "Balcony Seats: 198",
        totalPrice: 200,
        status: "Confirmed",
        bookingDate: new Date()
      }
    ]);
    console.log("Seeded Bookings successfully.");

    console.log("🎉 Database seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;

