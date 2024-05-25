const mongoose = require('mongoose');
const {profileSchema} = require('./ProfileSchema');

const userSchema = new mongoose.Schema ({
    email: String,
    password: String,
    cart: [],
    profile: profileSchema,
})

const User = new mongoose.model("User", userSchema);

module.exports = {User};