const express = require('express');
const router = express.Router();
const config = require('../config/config');
const jwt = require('jsonwebtoken');
const { auth } = require("../middleware");
const JWT_SECRET = config.JWT_SECRET;
const {User} = require('../db/model/UserSchema');



router.get("/", auth, async (req, res) => {
    try {
      const id = req.userId;
      const found = await User.findOne({ _id: id }).populate('profile.photoGallery');
  
      if (found) {
        if (found.profile) {
          const photoUrls = found.profile.photoGallery.map(
            (gallery) => gallery.url
          );
          const profileData = {
            username: found.profile.username,
            bio: found.profile.bio,
            profilePhoto: found.profile.profilePhoto,
            photoGallery: { photoUrl: photoUrls },
          };
  
          res.send(profileData);
        } else {
          res.send({ username: "Username", bio: "bio", photoGallery: { photoUrl: [] } });
        }
      } else {
        res.status(404).send({ error: "User not found" });
      }
    } catch (error) {
      res.status(500).send("An error occurred while fetching the profile.");
    }
  });
  
  
  
  router.post("/", auth, async (req, res) => {
    try {
      const id = req.userId;
      const found = await User.findOne({ _id: id });
  
      if (found) {
        if (found.profile) {
          found.profile.username = req.body.usernameText;
          found.profile.bio = req.body.bioText;
          await found.save();
        } else {
          const newProfile = new Profile({
            username: req.body.usernameText,
            bio: req.body.bioText,
          });
          await newProfile.save();
          found.profile = newProfile;
          await found.save();
        }
        res.send({ success: true });
      } else {
        res.status(404).send({ error: "User not found" });
      }
    } catch (error) {
      res.status(500).send("An error occurred while updating the profile.");
    }
  });

  router.post("/profilePhoto", auth, async (req, res) => {
    try {
      const id = req.userId;
      const photoUrl = req.body.profilePhoto;
  
      const found = await User.findOne({ _id: id });
  
      if (found) {
        if (found.profile) {
          found.profile.profilePhoto = photoUrl;
        } else {
          const profile = new Profile({
            username: "Username",
            bio: "Bio",
            profilePhoto: photoUrl
          });
          await profile.save();
          found.profile = profile;
        }
        await found.save();
        res.send({ success: true });
      } else {
        res.status(404).send({ error: "User not found" });
      }
    } catch (error) {
      res.status(500).send({ error: "Internal server error" });
    }
  });
  
  
  
  
  router.post("/gallery", auth, async (req, res) => {
    try {
      const id = req.userId;
      const photoUrl = req.body.url;
      const sp = req.body.price;
      const words = req.body.keywords;
      const keywords = words.split(", ");
      const category = req.body.category;
      const width = req.body.width;
      const height = req.body.height;
      const orientation = width > height ? "horizontal" : "vertical";
  
      const found = await User.findOne({ _id: id });
  
      if (found) {
        if (found.profile) {
          if (found.profile.photoGallery.length > 0) {
            found.profile.photoGallery.push({
              url: photoUrl,
              sp: sp,
              keywords: keywords,
              category: category,
              size: [height, width],
              orientation: orientation
            });
          } else {
            const gallery = new Gallery({
              url: photoUrl,
              sp: sp,
              keywords: keywords,
              category: category,
              size: [height, width],
              orientation: orientation
            });
            await gallery.save();
            found.profile.photoGallery = [gallery];
          }
        } else {
          const gallery = new Gallery({
            url: photoUrl,
            sp: sp,
            keywords: keywords,
            category: category,
            size: [height, width],
            orientation: orientation
          });
          await gallery.save();
          const newProfile = new Profile({
            username: "",
            bio: "",
            photoGallery: [gallery]
          });
          await newProfile.save();
          found.profile = newProfile;
        }
        await found.save();
        res.send({ success: true });
      } else {
        res.status(404).send({ error: "User not found" });
      }
    } catch (error) {
      res.status(500).send({ error: "Internal server error" });
    }
  });

  router.delete("/gallery", auth, async (req, res) => {
    try {
      const userId = req.userId;
      const { photoUrl } = req.body;
  
      const found = await User.findOne({ _id: userId }).populate('profile.photoGallery');
  
      if (found) {
        if (found.profile && found.profile.photoGallery.length > 0) {
          const photoGallery = found.profile.photoGallery;
          const updatedPhotoGallery = photoGallery.filter(
            (gallery) => gallery.url !== photoUrl
          );
          found.profile.photoGallery = updatedPhotoGallery;
          await found.save();
          res.send({ success: true });
        } else {
          res.status(404).send({ error: "Photo gallery not found" });
        }
      } else {
        res.status(404).send({ error: "User not found" });
      }
    } catch (error) {
      res.status(500).send({ error: "Internal server error" });
    }
  }); 
  
  

  module.exports = router;