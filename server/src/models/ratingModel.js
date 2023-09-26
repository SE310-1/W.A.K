// Importing required modules
const mongoose = require("mongoose");

// Defining the schema for ratings
const Schema = mongoose.Schema;

// Creating a new schema for user ratings with username and movies properties
const ratingScheme = new Schema({
    username: {
        type: String,
        required: true, // username is a required field
    },
    movies: [
        {
            movieTitle: {
                type: String,
                required: true, // movieTitle is a required field within the movies array
            },
            rating: {
                type: Number,
                required: true, // rating is a required field within the movies array
            },
        },
    ],
});

// Adding a static method to the schema to review or update a movie rating for a user
ratingScheme.statics.review = async function (username, movie, rating) {
    // Finding the existing user rating using the username
    const existingUserRating = await this.findOne({ username });

    if (existingUserRating) {
        // If the user has previously rated movies, finding the index of the movie in the array
        const movieIndex = existingUserRating.movies.findIndex(
            (item) => item.movieTitle === movie
        );

        if (movieIndex !== -1) {
            // If the movie is already in the array, updating its rating
            existingUserRating.movies[movieIndex].rating = rating;
        } else {
            // If the movie is not in the array, adding it with the rating
            existingUserRating.movies.push({
                movieTitle: movie,
                rating: rating,
            });
        }

        // Saving and returning the updated user rating
        return existingUserRating.save();
    } else {
        // If the user has not previously rated any movies, creating a new entry with the movie and rating
        return this.create({
            username,
            movies: [{ movieTitle: movie, rating: rating }],
        });
    }
};

// Exporting the Rating model for use in other files
module.exports = mongoose.model("Rating", ratingScheme);
