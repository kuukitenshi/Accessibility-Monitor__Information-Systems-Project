const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('node:fs');
const websiteRoute = require('./routes/websiteRoute');
const webpageRoute = require('./routes/webpageRoute');
const path = require('path');

const app = express();
const port = 3069;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.json());
app.use(cors());
app.use('/websites', websiteRoute);
app.use('/webpages', webpageRoute);

async function start() {
    mongoose.set('strictQuery', false);
    console.log('Reading connection string from file...');
    const conn_string = fs.readFileSync('mongodb_conn_string.txt').toString();
    console.log('Connecting to MongoDB...');
    await mongoose.connect(conn_string);
    console.log('Connection to MongoDB has been established!');
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
}

start();
