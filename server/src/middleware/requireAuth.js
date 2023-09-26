// Importing required dependencies
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Defining the requireAuth middleware for protecting routes
const requireAuth = async (req, res, next) => {
    // Extracting the authorization header from the incoming request
    const { authorization } = req.headers;

    // If the authorization header is not present, return a 401 Unauthorized response
    if (!authorization) {
        return res.status(401).json({ error: "Authorization token required" });
    }

    // Extracting the JWT token from the authorization header
    const token = authorization.split(" ")[1];

    try {
        // Verifying the JWT token using the secret key and extracting the user ID
        const { _id } = jwt.verify(token, process.env.SECRET);

        // Fetching the user from the database using the user ID and attaching it to the request object
        req.user = await User.findOne({ _id }).select("_id");

        // Proceeding to the next middleware or route handler
        next();
    } catch (error) {
        // Logging the error and returning a 401 Unauthorized response if token verification fails
        console.log(error);
        res.status(401).json({ error: "Request is not authorized" });
    }
};

// Exporting the requireAuth middleware for use in other modules
module.exports = requireAuth;
