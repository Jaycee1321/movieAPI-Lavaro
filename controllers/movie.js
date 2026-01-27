const Movie = require('../models/Movie');

// Add a new movie
module.exports.addMovie = async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.status(201).json({ message: 'Movie added successfully', movie });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all movies
module.exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single movie by ID
module.exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update movie
module.exports.updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json({ message: 'Movie updated successfully', movie });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete movie
module.exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json({ message: 'Movie deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add comment to a movie
module.exports.addMovieComment = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    movie.comments.push({ username: req.user.email, text: req.body.text });
    await movie.save();

    res.status(201).json({ message: 'Comment added', comments: movie.comments });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get comments of a movie
module.exports.getMovieComments = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id, 'comments');
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie.comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};