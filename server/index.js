require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const User = require("./src/models/userModel");
const Rating = require("./src/models/ratingModel");
const jwt = require("jsonwebtoken");
const requireAuth = require("./src/middleware/requireAuth");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/test", (req, res) => {
  res.json({
    movies: ["The Matrix", "The Matrix Reloaded", "The Matrix Revolutions"],
  });
});

app.get("/search", (req, res) => {
  res.sendFile(__dirname + "../../client/src/Pages/Search/Search.jsx");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.login(username, password);

    // create a token
    const token = createToken(user._id);

    res.status(200).json({ username, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/signup", async (req, res) => {
  const { email, username, password } = req.body;

  try {
    const user = await User.signup(email, username, password);
    const token = createToken(user._id);
    res.status(200).json({ email, username, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/rating", async (req, res) => {
  const { username, rating, movie } = req.body;

  try {
    console.log("WAITIN");
    await Rating.review(username, movie, rating);
    res.status(200).json({ username, movie, rating });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/rating/movie/:movieId", async (req, res) => {
  const { movieId } = req.params;
  const username = req.user.username; // Assuming you have user authentication middleware

  try {
    const existingUserRating = await Rating.findOne({ username });
    if (existingUserRating) {
      const movieRating = existingUserRating.movies.find(
        (item) => item.movieId === movieId
      );
      if (movieRating) {
        res.json({ rating: movieRating.rating });
      } else {
        res.json({ rating: null }); // Movie not rated by the user
      }
    } else {
      res.json({ rating: null }); // User has not rated any movies
    }
  } catch (error) {
    console.error("Error fetching movie rating:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/favorites", requireAuth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user.favorites);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/favorites/add/:movieId", requireAuth, async (req, res) => {
  const { movieId } = req.params;

  try {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) return res.status(404).json({ error: "User not found" });
    await user.addFavorite(movieId);
    res.status(200).json({ message: "Movie added to favorites" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/favorites/remove/:movieId", requireAuth, async (req, res) => {
  const { movieId } = req.params;

  try {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) return res.status(404).json({ error: "User not found" });
    await user.removeFavorite(movieId);
    res.status(200).json({ message: "Movie removed from favorites" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/favorites/isFavorite/:movieId", requireAuth, async (req, res) => {
  const userId = req.user._id;
  const { movieId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isFavorite = user.favorites.find(
      (favoriteMovieId) => String(favoriteMovieId) === String(movieId)
    );

    if (!isFavorite) {
      return res.json({ message: "Movie not in favourites" });
    }

    res.status(200).json({ message: "Movie in favorites" });
  } catch (error) {
    console.error("Error fetching favorite movie:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`Server IS running` + process.env.PORT)
    );
  })
  .catch((err) => {
    console.log(err);
  });
