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


const Gallery = new mongoose.model("Gallery",gallerySchema);

module.exports = {Gallery, gallerySchema};