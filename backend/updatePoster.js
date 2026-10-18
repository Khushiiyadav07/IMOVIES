
require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const Movie = require("./models/movieModel");

const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  "mongodb://127.0.0.1:27017/imovies";

const posters = [
  { title: "Toxic", poster: "/images/toxic_poster.png" },
  { title: "Bagheera", poster: "/images/Bagheera_poster.jpg" },
  { title: "Baahubali 2: the conclusion", poster: "/images/Bahubali-2_poster.jpg"},
  { title: "Og", poster: "/images/OG_poster.jpg" },
  { title: "Rajasabb", poster: "/images/Rajasaab_poster.jpg" },
  { title: "Rrr", poster: "/images/rrr_poster.jpg" },
  { title: "The pride of bharat", poster: "/images/The-pride-of-bharat_poster.jpg" },
];

async function updatePosters() {
  try {
    await mongoose.connect(MONGO_URI);

    for (const movie of posters) {
      const result = await Movie.updateOne(
        { title: { $regex: `^${movie.title}$`, $options: "i" } },
        { $set: { poster: movie.poster } }
      );

      console.log(
        `${movie.title}: matched=${result.matchedCount}, modified=${result.modifiedCount}`
      );
    }
  } catch (error) {
    console.log("Error:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

updatePosters();
