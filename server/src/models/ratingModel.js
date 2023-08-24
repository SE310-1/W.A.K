const mongoose = require('mongoose')
const validator = require('validator')

const Schema = mongoose.Schema

const ratingScheme = new Schema({
    username: {
        type: String,
        required: true
    },
    movie:{
        type: String,
        required: true
    },
    rating:{
        type: Number,
        required: true
    }
    }
)


ratingScheme.statics.review = async function (username, movie, rating){
    return this.create({username, movie, rating})
}

module.exports = mongoose.model('Rating', ratingScheme)