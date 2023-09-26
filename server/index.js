require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const User = require("./src/models/userModel");
const Rating = require("./src/models/ratingModel");
const jwt = require("jsonwebtoken");
const userModel = require("./src/models/userModel");
const requireAuth = require("./src/middleware/requireAuth");

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
    );
    next();
});

app.get("/test", (req, res) => {
    res.json({
        movies: ["The Matrix", "The Matrix Reloaded", "The Matrix Revolutions"],
    });
});

app.get("/search", (req, res) => {
    res.sendFile(__dirname + "../../client/src/Pages/Search/Search.jsx");
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.login(username, password);

        // create a token
        const token = createToken(user._id);

        res.status(200).json({ username, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post("/signup", async (req, res) => {
    const { email, username, password } = req.body;

    try {
        const user = await User.signup(email, username, password);
        const token = createToken(user._id);
        res.status(200).json({ email, username, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post("/rating", async (req, res) => {
    const { username, rating, movie } = req.body;
    try {
        await Rating.review(username, movie, rating);
        res.status(200).json({ username, movie, rating });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get("/api/:username/ratings", async (req, res) => {
    const { username } = req.params;
    try {
        const existingUserRating = await Rating.findOne({ username });
        if (existingUserRating) {
            res.json(existingUserRating);
        } else {
            res.json({ rating: null }); // User has not rated any movies
        }
    } catch (error) {
        console.error("Error fetching movie rating:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Route to get all users.
app.get("/users", async (req, res) => {
    try {
        const result = await User.find();
        res.json(result);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: error.message });
    }
});

// Route to add a friend request.
app.put("/user/:myUsername/add-friend/:friendUsername", async (req, res) => {
    const myUsername = req.params.myUsername;
    const friendUsername = req.params.friendUsername;
    try {
        const result = await User.findOneAndUpdate(
            { username: friendUsername },
            { $addToSet: { friendsRequests: myUsername } }
        );
        res.send(result);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: error.message });
    }
});

// Route to get all friend requests for a user.
app.get("/friend-requests/:myUsername", async (req, res) => {
    const myUsername = req.params.myUsername;
    try {
        const result = await User.findOne({ username: myUsername });
        res.json(result.friendsRequests);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: error.message });
    }
});

// Route to get a user's username.
app.get("/user/:myUsername", async (req, res) => {
    const myUsername = req.params.myUsername;
    try {
        const result = await User.findOne({ username: myUsername });
        res.json(result.username);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: error.message });
    }
});

// Route to decline a friend request.
app.put(
    "/user/:myUsername/decline-friend-request/:friendUsername",
    async (req, res) => {
        const myUsername = req.params.myUsername;
        const friendUsername = req.params.friendUsername;
        try {
            const result = await User.findOneAndUpdate(
                { username: myUsername },
                { $pull: { friendsRequests: friendUsername } }
            );
            res.send(result);
        } catch (error) {
            console.error("Error decline friend request:", error);
            res.status(500).json({ error: error.message });
        }
    }
);

// Route to accept a friend request.
app.put(
    "/user/:myUsername/accept-friend-request/:friendUsername",
    async (req, res) => {
        const myUsername = req.params.myUsername;
        const friendUsername = req.params.friendUsername;
        try {
            const result = await User.findOneAndUpdate(
                { username: myUsername },
                { $addToSet: { friends: friendUsername } }
            );
            res.send(result);
        } catch (error) {
            console.error("Error accepting friend request:", error);
            res.status(500).json({ error: error.message });
        }
    }
);

// Route to get all friends for a user.
app.get("/friends/:myUsername", async (req, res) => {
    const myUsername = req.params.myUsername;
    try {
        const result = await User.findOne({ username: myUsername });
        res.json(result.friends);
    } catch (error) {
        console.error("Error showing friends:", error);
        res.status(500).json({ error: error.message });
    }
});

// Route to get all the favorite movies of a user
app.get("/:myUsername/favorites", requireAuth, async (req, res) => {
    const myUsername = req.params.myUsername;
    try {
        const result = await User.findOne({ username: myUsername });
        res.json(result.favorites);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: error.message });
    }
});

// Route to add a movie to the favorites list
app.post(
    "/:myUsername/favorites/add/:movieId",
    requireAuth,
    async (req, res) => {
        const movieId = req.params.movieId;
        const myUsername = req.params.myUsername;

        try {
            const user = await User.findOne({ username: myUsername });
            if (!user) return res.status(404).json({ error: "User not found" });
            await user.addFavorite(movieId);
            res.status(200).json({ message: "Movie added to favorites" });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
);

// Route to delete a movie from the favorites list
app.delete(
    "/:myUsername/favorites/remove/:movieId",
    requireAuth,
    async (req, res) => {
        const movieId = req.params.movieId;
        const myUsername = req.params.myUsername;

        try {
            const user = await User.findOne({ username: myUsername });
            if (!user) return res.status(404).json({ error: "User not found" });
            await user.removeFavorite(movieId);
            res.status(200).json({ message: "Movie removed from favorites" });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
);

// Route to retrieve all favorite movies
app.get(
    "/:myUsername/favorites/isFavorite/:movieId",
    requireAuth,
    async (req, res) => {
        const myUsername = req.params.myUsername;
        const movieId = req.params.movieId;
        try {
            const user = await User.findOne({ username: myUsername });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            const isFavorite = user.favorites.includes(String(movieId));
            res.status(200).json({ isFavorite });
        } catch (error) {
            console.error("Error fetching favorite movie:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
);

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () =>
            console.log(`Server is running on port: ` + process.env.PORT)
        );
    })
    .catch((err) => {
        console.log(err);
    });
