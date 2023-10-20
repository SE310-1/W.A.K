// Importing required modules
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

// Defining the schema for a User
const Schema = mongoose.Schema;

// Creating a new schema for the User with several properties
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true, // The email should be unique for every user
  },
  username: {
    type: String,
    required: true,
    unique: true, // The username should be unique for every user
  },
  password: {
    type: String,
    required: true,
  },
  favorites: [
    {
      movieId: {
        type: String, // storing the ID of the movie according to TMDB
        required: true,
      },
      addedAt: {
        type: Date, // date when it was added to favourites
      },
      movieTitle: {
        type: String,
        required: true,
      },
    },
  ],

  friends: {
    type: Array,
  },
  friendsRequests: {
    type: Array,
  },
  outgoingRequests: {
    type: Array,
  },
  profilePicture: [
    {
      movieId: {
        type: String, // storing the ID of the movie according to TMDB
        required: true,
      },
      addedAt: {
        type: Date, // date when it was added to favourites
      },
    },
  ],
});

// Static method to signup a new user
userSchema.statics.signup = async function (email, username, password) {
  // Validation checks

  if (!email || !password) {
    throw Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email not valid");
  }

  // Check if email already exists in the database
  const [exists] = await Promise.all([this.findOne({ email })]);

  if (exists) {
    throw Error("Email already in use");
  }

  // Encrypt the password before storing it
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  // Create and return a new user
  return this.create({ email, username, password: hash });
};

// Static method to login a user
userSchema.statics.login = async function (username, password) {
  if (!username || !password) {
    throw Error("All fields must be filled");
  }

  // Check if the user with the provided username exists
  const [user] = await Promise.all([this.findOne({ username })]);

  if (!user) {
    throw Error("Incorrect email");
  }

  // Check if the provided password matches the stored password
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Incorrect password");
  }

  return user;
};

// Static method to login a user
// #TODO
userSchema.statics.loginWithGoogleJWT = async function (googleJWT) {
  if (!googleJWT) {
    throw Error("Google JWT must be supplied");
  }

  // #TODO: Need to check that the JWT is valid
  // then extract email and check if a user exists

  // Check if the user with the provided username exists
  const [user] = await Promise.all([this.findOne({ username })]);

  if (!user) {
    // #TODO: Need to create a user
    // return newUser;
  }

  // Return the user so a JWT can be created
  return user;
};

// Method to add a movie to the user's favorites
userSchema.methods.addFavorite = async function (movieId, movieTitle) {
  if (this.favorites.some((fav) => fav.movieId === movieId)) {
    throw Error("Movie already in favorites");
  }
  this.favorites.push({
    movieId: movieId,
    movieTitle: movieTitle,
    addedAt: new Date(),
  });
  return this.save();
};

// Method to remove a movie from the user's favorites
userSchema.methods.removeFavorite = async function (movieId) {
  const index = this.favorites.findIndex((fav) => fav.movieId === movieId);
  if (index === -1) {
    throw Error("Movie not found in favorites");
  }
  this.favorites.splice(index, 1);
  return this.save();
};

// Method to replace current profile picture with new one
userSchema.methods.replaceProfilePicture = async function (movieId) {
  this.profilePicture.splice(0, 1);
  this.profilePicture.push({
    movieId: movieId,
    addedAt: new Date(),
  });
  return this.save();
};

// Set

// Exporting the User model for use in other files
module.exports = mongoose.model("User", userSchema);
