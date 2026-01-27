// Packages and Modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

const movieRoutes = require("./routes/movie");
const userRoutes = require("./routes/user");

require('dotenv').config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGODB_STRING)
    .then(() => console.log('Now connected to MongoDB Atlas.'))
    .catch(err => console.error('MongoDB connection failed:', err));

// Routes
app.use("/movies", movieRoutes);
app.use("/users", userRoutes);

// Server ports
if(require.main === module){
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`API is now online on port ${PORT}`);
    });
}

module.exports = { app, mongoose };
