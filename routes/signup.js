const express = require('express');
const router = express.Router();
const config = require('../config/config');
const jwt = require('jsonwebtoken');
const { auth } = require("./middleware");
const JWT_SECRET = config.JWT_SECRET;



module.exports = router;