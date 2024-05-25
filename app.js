
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { auth } = require("./middleware");
const config = require("./config/config");
const home = require('./routes/home.js');
const profile = require('./routes/profile');


const app = express();


app.use(cors({origin: 'https://photo-stocks.netlify.app'}));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'photoStorage')));


const {mongoosedb} = require('./db/mongoose.js');

app.use("/", home);
app.use("/profile", profile);

const PORT = config.port;

app.listen(PORT,() => console.log(`Photo-stock server is running on port ${PORT}.`))
