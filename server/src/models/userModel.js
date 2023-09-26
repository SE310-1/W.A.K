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
    favorites: {
        type: [String], // storing IDs of the favourite movies
    },
    friends: {
        type: Array,
    },
    friendsRequests: {
        type: Array,
    },
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

// Method to add a movie to the user's favorites
userSchema.methods.addFavorite = async function (movieId) {
    if (this.favorites.includes(movieId)) {
        throw Error("Movie already in favorites");
    }
    this.favorites.push(movieId);
    return this.save();
};

// Method to remove a movie from the user's favorites
userSchema.methods.removeFavorite = async function (movieId) {
    const index = this.favorites.indexOf(movieId);
    if (index === -1) {
        throw Error("Movie not found in favorites");
    }
    this.favorites.splice(index, 1);
    return this.save();
};

// Exporting the User model for use in other files
module.exports = mongoose.model("User", userSchema);
