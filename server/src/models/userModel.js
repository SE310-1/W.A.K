const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    favorites: {
        type: Array, // storing IDs of the favourite movies
    },
    friends: {
        type: Array,
    },
    friendsRequests: {
        type: Array,
    },
});

// static signup method
userSchema.statics.signup = async function (email, username, password) {
    // validation
    if (!email || !password) {
        throw Error("All fields must be filled");
    }
    if (!validator.isEmail(email)) {
        throw Error("Email not valid");
    }
    const [exists] = await Promise.all([this.findOne({ email })]);

    if (exists) {
        throw Error("Email already in use");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return this.create({ email, username, password: hash });
};

// static login method
userSchema.statics.login = async function (username, password) {
    if (!username || !password) {
        throw Error("All fields must be filled");
    }
    const [user] = await Promise.all([this.findOne({ username })]);
    if (!user) {
        throw Error("Incorrect email");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw Error("Incorrect password");
    }

    return user;
};

userSchema.methods.addFavorite = async function (movieId) {
    if (this.favorites.includes(movieId)) {
        throw Error("Movie already in favorites");
    }
    this.favorites.push(movieId);
    return this.save();
};

userSchema.methods.removeFavorite = async function (movieId) {
    const index = this.favorites.indexOf(movieId);
    if (index === -1) {
        throw Error("Movie not found in favorites");
    }
    this.favorites.splice(index, 1);
    return this.save();
};

module.exports = mongoose.model("User", userSchema);
