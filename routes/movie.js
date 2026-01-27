const express = require('express');
const movieController = require('../controllers/movie');
const { verify, verifyAdmin } = require('../auth');

const router = express.Router();

// Public routes (all users)
router.get('/getMovies', movieController.getAllMovies);
router.get('/getMovie/:id', movieController.getMovieById);
router.get('/getComments/:id', movieController.getMovieComments);

// Authenticated user routes
router.post('/addComment/:id', verify, movieController.addMovieComment);

// Admin-only routes
router.post('/addMovie', verify, verifyAdmin, movieController.addMovie);
router.put('/updateMovie/:id', verify, verifyAdmin, movieController.updateMovie);
router.delete('/deleteMovie/:id', verify, verifyAdmin, movieController.deleteMovie);

module.exports = router;


