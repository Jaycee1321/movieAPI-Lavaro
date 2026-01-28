const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  username: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is Required']
    },
    director: {
        type: String,
        required: [true, 'Director is Required']
    },
    year: {
        type: Number,
        required: [true, 'Year is Required']
    },
    description: {
        type: String,
        required: [true, 'Description is Required']
    },
    genre: {
        type: String,
        required: [true, 'Genre is Required']
    },
    rating: {
        type: Number,
        required: [true, 'Rating is Required'],
        min: 1,
        max: 5
    },
    comments: [commentSchema]
});


module.exports = mongoose.model('Movie', movieSchema);