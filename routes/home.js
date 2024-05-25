const express = require('express');
const router = express.Router();
const config = require('../config/config');
const jwt = require('jsonwebtoken');
const { auth } = require("../middleware");
const JWT_SECRET = config.JWT_SECRET;
const {User} = require('../db/model/UserSchema');

router.post("/login", async (req, res) => {
    try {
      const mail = req.body.email;
      const pass = req.body.password;
  
      const found = await User.findOne({ email: mail });
  
      if (found) {
        if (found.password === pass) {
          const token = jwt.sign({ id: found._id }, JWT_SECRET);
          res.json({ token });
        } else {
          res.send({ result: "Incorrect Password" });
        }
      } else {
        res.send({ result: "User Not Found" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred during login.");
    }
  });


  router.post("/signup", async (req, res) => {
    try {
      const found = await User.findOne({ email: req.body.email });
  
      if (!found) {
        const user1 = new User(req.body);
        await user1.save();
        res.send(req.body);
      } else {
        res.send({});
      }
    } catch (error) {
      res.status(500).send("An error occurred during signup.");
    }
  });

  router.get("/", async (req, res) => {
    try {
      const users = await User.find({}).populate('profile.photoGallery');
  
      const allPhotos = users.reduce((photos, user) => {
        if (user.profile && user.profile.photoGallery) {
          const userPhotos = user.profile.photoGallery
            .map((gallery) => ({
              username: user.profile.username,
              userId: user._id,
              photoUrl: gallery.url,
              photoId: gallery._id,
              sp: gallery.sp,
              keywords: gallery.keywords,
              category: gallery.category,
              size: gallery.size,
              orientation: gallery.orientation          
            }))
            .filter((photo) => photo.photoUrl !== '');
          photos.push(...userPhotos);
        }
        return photos;
      }, []);
  
      res.send(allPhotos);
    } catch (error) {
      res.status(500).send({ error: "Internal server error" });
    }
  });



  
router.get('/search', async (req, res) => {
    try {
      const query = req.query.query;
  
      const users = await User.find({}).populate('profile.photoGallery');
  
      const searchResults = users.reduce((photos, user) => {
        if (user.profile && user.profile.photoGallery) {
          const userPhotos = user.profile.photoGallery
            .filter((gallery) => gallery.url !== '') // Exclude photos with empty URLs
            .filter((gallery) => {
              // Check if any keyword contains the search query substring
              return gallery.keywords.some((keyword) =>
                keyword.toLowerCase().includes(query.toLowerCase())
              );
            })
            .map((gallery) => ({
              username: user.profile.username,
              userId: user._id,
              photoUrl: gallery.url,
              photoId: gallery._id,
              sp: gallery.sp,
              keywords: gallery.keywords,
              category: gallery.category,
              size: gallery.size,
              orientation: gallery.orientation,
            }));
  
          photos.push(...userPhotos);
        }
        return photos;
      }, []);
  
      res.send(searchResults);
    } catch (error) {
      res.status(500).send({ error: "Internal server error" });
    }
  });

  module.exports = router