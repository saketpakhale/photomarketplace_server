const {gallerySchema} = require('./GallerySchema');
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema ({
    username: String,
    bio: String,
    profilePhoto: String,
    photoGallery: [gallerySchema]
})

const Profile = new mongoose.model("Profile", profileSchema);

module.exports = {Profile, profileSchema};