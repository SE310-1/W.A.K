require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/test', (req, res) => {
    res.json({"movies": ["The Matrix", "The Matrix Reloaded", "The Matrix Revolutions"]});
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => console.log(`Server IS running`));
    })
    .catch(err => {
        console.log(err);
    })
