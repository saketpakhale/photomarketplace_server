const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema ({
    url: String,
    sp: String,
    keywords: [String],
    category: String,
    orientation: String,
    size: [Number],
    likes: Number
})

module.exports = {gallerySchema};