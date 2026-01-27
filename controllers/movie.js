const Movie = require('../models/Movie');
const { errorHandler } = require('../auth');

// Add movie
module.exports.addMovie = (req, res) => {

    const { title, description, year, genre } = req.body;

    if (!title || !description || !year || !genre) {
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

            const newMovie = new Movie(req.body);

            return newMovie.save()
                .then(movie => res.status(201).send({
                    message: "Movie added successfully",
                    movie
                }));
        })
        .catch(error => errorHandler(error, req, res));
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

    Movie.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
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
    .catch(error => errorHandler(error, req, res));
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
module.exports.addMovieComment = (req, res) => {

    if (!req.body.text) {
        return res.status(400).send({
            message: "Comment text is required"
        });
    }

    Movie.findById(req.params.id)
        .then(movie => {

            if (!movie) {
                return res.status(404).send({
                    message: "Movie not found"
                });
            }

            movie.comments.push({
                username: req.user.email,
                text: req.body.text
            });

            return movie.save()
                .then(() => res.status(201).send({
                    message: "Comment added successfully",
                    comments: movie.comments
                }));
        })
        .catch(error => errorHandler(error, req, res));
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