// Importing required modules
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { OAuth2Client } = require('google-auth-library');

let GOOGLE_CLIENT_ID;

// Use an immediately-invoked async function to allow top-level await
(async () => {
  const env = await import("../../../client/env.js");
  GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID;
})();

// const { GOOGLE_CLIENT_ID } = require("../../../client/env");
const client = new OAuth2Client(GOOGLE_CLIENT_ID);


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

const User = mongoose.model("User", userSchema);


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

async function verifyGoogleToken(token) {
  try {
      const ticket = await client.verifyIdToken({
          idToken: token,
          audience: GOOGLE_CLIENT_ID,
      });
      return ticket;
  } catch (error) {
      console.error('Error verifying Google token:', error);
      throw error;
  }
}


// Static method to login a user
// #TODO
User.loginWithGoogleJWT = async function (googleJWT) {
  if (!googleJWT) {
    throw Error("Google JWT must be supplied");
  }

  // #TODO: Need to check that the JWT is valid
  // then extract email and check if a user exists

    // Verify Google JWT using the helper function
    let payload;
    try {
        const ticket = await verifyGoogleToken(googleJWT);
        payload = ticket.getPayload();
    } catch (error) {
        throw Error('Invalid Google JWT');
    }

     // Extract email from the payload
  const email = payload['email'];
  if (!email) {
    throw Error('Email not found in JWT payload');
  }

    // Check if the user with the provided email exists
    let user = await User.findOne({ email: email });

    if (!user) {
      // Derive a username from the email
      const derivedUsername = email.split('@')[0]; // Use the part of the email before the @ symbol as the username
      const usernameExists = await User.findOne({ username: derivedUsername });
  
      // Create a new user
      user = await User.create({
        email: email,
        username: derivedUsername,  // Use the derived username
        password: bcrypt.hashSync('google-' + payload['sub'], 10), // Use a default password or any dummy one, as it won't be used
        friends: [],
        friendsRequests: [],
        outgoingRequests: [],
        profilePicture: [],
        favorites: [],
      });
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
