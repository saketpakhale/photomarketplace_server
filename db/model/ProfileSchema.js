const {gallerySchema} = require('./GallerySchema');
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema ({
    username: String,
    bio: String,
    profilePhoto: String,
    photoGallery: [gallerySchema]
})


module.exports = {profileSchema};