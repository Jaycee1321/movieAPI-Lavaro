const Movie = require('../models/Movie');
const { errorHandler } = require('../auth');

// Add movie
module.exports.addMovie = (req, res) => {
    const { title, description, year, genre, director, rating } = req.body;

    if (!title || !description || !year || !genre || !director || rating == null) {
        return res.status(400).send({
            message: "Please provide all movie details"
        });
    }

    Movie.findOne({ title })
        .then(existingMovie => {
            if (existingMovie) {
                return res.status(409).send({
                    message: "Movie already exists"
                });
            }

            const newMovie = new Movie({
                title,
                description,
                year,
                genre,
                director,
                rating
            });

            return newMovie.save()
                .then(movie => res.status(201).send({
                    message: "Movie added successfully",
                    movie
                }));
        })
        .catch(error => {
            console.error("Add Movie Error:", error);
            errorHandler(error, req, res);
        });
};


// Get all movies
module.exports.getAllMovies = (req, res) => {

    Movie.find()
        .then(movies => {
            return res.status(200).send({
                movies
            });
        })
        .catch(error => errorHandler(error, req, res));
};

// Get movie by ID
module.exports.getMovieById = (req, res) => {

    Movie.findById(req.params.id)
        .then(movie => {

            if (!movie) {
                return res.status(404).send({
                    message: "Movie not found"
                });
            }

            return res.status(200).send({
                movie
            });
        })
        .catch(error => errorHandler(error, req, res));
};

// Update movie
module.exports.updateMovie = (req, res) => {
    const { title, description, year, genre, director, rating } = req.body;

    if (!title || !description || !year || !genre || !director || rating == null) {
        return res.status(400).send({
            message: "Please provide all movie details"
        });
    }

    Movie.findByIdAndUpdate(
        req.params.id,
        { title, description, year, genre, director, rating },
        { new: true, runValidators: true }
    )
    .then(movie => {
        if (!movie) {
            return res.status(404).send({
                message: "Movie not found"
            });
        }

        return res.status(200).send({
            message: "Movie updated successfully",
            updatedMovie: movie
        });
    })
    .catch(error => {
        console.error("Update Movie Error:", error);
        errorHandler(error, req, res);
    });
};



// Delete movie
module.exports.deleteMovie = (req, res) => {

    Movie.findByIdAndDelete(req.params.id)
        .then(deletedMovie => {

            if (!deletedMovie) {
                return res.status(404).send({
                    message: "Movie not found"
                });
            }

            return res.status(200).send({
                message: "Movie deleted successfully"
            });
        })
        .catch(error => errorHandler(error, req, res));
};

// Add comment to movie
module.exports.addMovieComment = async (req, res) => {
  try {
    // Check authentication
    if (!req.user || !req.user.email) {
      return res.status(401).send({ message: "You must be logged in to comment" });
    }

    const commentText = req.body.text || req.body.comment;
    if (!commentText) {
      return res.status(400).send({ message: "Comment text is required" });
    }

    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send({ message: "Movie not found" });

    movie.comments.push({
      username: req.user.email,
      text: commentText
    });

    await movie.save();

    return res.status(201).send({
      message: "Comment added successfully",
      comments: movie.comments
    });
  } catch (err) {
    console.error("Add Comment Error:", err);
    return res.status(500).send({ message: "Failed to add comment" });
  }
};


// Get movie comments
module.exports.getMovieComments = (req, res) => {

    Movie.findById(req.params.id, 'comments')
        .then(movie => {

            if (!movie) {
                return res.status(404).send({
                    message: "Movie not found"
                });
            }

            return res.status(200).send({
                comments: movie.comments
            });
        })
        .catch(error => errorHandler(error, req, res));
};