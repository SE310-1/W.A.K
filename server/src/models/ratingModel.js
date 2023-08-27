const mongoose = require('mongoose')
const validator = require('validator')

const Schema = mongoose.Schema

const ratingScheme = new Schema({
    username: {
        type: String,
        required: true
    },
    movies: [{
        movieTitle: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true
        }
    }]
});


ratingScheme.statics.review = async function (username, movie, rating) {
    const existingUserRating = await this.findOne({ username });

    if (existingUserRating) {
        const movieIndex = existingUserRating.movies.findIndex(item => item.movieTitle === movie);
        if (movieIndex !== -1) {
            existingUserRating.movies[movieIndex].rating = rating;
        } else {
            existingUserRating.movies.push({ movieTitle: movie, rating: rating });
        }
        return existingUserRating.save();
    } else {
        return this.create({
            username,
            movies: [{ movieTitle: movie, rating: rating }]
        });
    }
};

module.exports = mongoose.model('Rating', ratingScheme)