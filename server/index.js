require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const User = require("./src/models/userModel");
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'})
}

app.use(express.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/test', (req, res) => {
    res.json({"movies": ["The Matrix", "The Matrix Reloaded", "The Matrix Revolutions"]});
});

app.post('/login', async (req, res) => {
    const {username, password} = req.body

    try {
        const user = await User.login(username, password)

        // create a token
        const token = createToken(user._id)

        res.status(200).json({username, token})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
});

app.post('/signup', async (req, res) => {
    const {email, username, password} = req.body

    try {
        const user = await User.signup(email, username, password)
        const token = createToken(user._id)
        res.status(200).json({email, username, token})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => console.log(`Server IS running` + process.env.PORT));
    })
    .catch(err => {
        console.log(err);
    })
