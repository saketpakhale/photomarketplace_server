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
      const index = parseInt(req.query.index) || 0;
      const offset = parseInt(req.query.offset) || 10;
      const filter = req.query.filter || "none";
      const sort = req.query.sort || "none";
      const users = await User.find({});
  
      let allPhotos = users.reduce((photos, user) => {
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
      
      if(filter!=="none") {
        allPhotos = allPhotos.filter((photo) => photo.category === filter);
      }

      if(sort !== "none") {
        if(sort === "priceLowToHigh") {
          allPhotos.sort((a,b) => a.sp - b.sp);
        } else if (sort === "priceHighToLow"){
          allPhotos.sort((a,b) => b.sp - a.sp);
        }
      }
      
      if(index < allPhotos.length) {        
        if(index + offset <= allPhotos.length) {
          res.send(allPhotos.slice(index,index+offset));
        } else {
          res.send(allPhotos.slice(index));
        }
      } else {
        res.send({message: "end reached"});
      }

    } catch (error) {
      console.log(error);
      res.status(500).send({ error: "Internal server error" });
    }
});
  
router.get('/search', async (req, res) => {
    try {
      const query = req.query.searchQuery;
      const index = parseInt(req.query.index) || 0;
      const offset = parseInt(req.query.offset) || 12;
      const filter = req.query.filter || "none";
      const sort = req.query.sort || "none";
  
      const users = await User.find({});
  
      let searchResults = users.reduce((photos, user) => {
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
  
      if(filter!=="none") {
        searchResults = searchResults.filter((photo) => photo.category === filter);
      }

      if(sort !== "none") {
        if(sort === "priceLowToHigh") {
          searchResults.sort((a,b) => a.sp - b.sp);
        } else if (sort === "priceHighToLow"){
          searchResults.sort((a,b) => b.sp - a.sp);
        }
      }
      
      if(index < searchResults.length) {        
        if(index + offset <= searchResults.length) {
          res.send(searchResults.slice(index,index+offset));
        } else {
          res.send(searchResults.slice(index));
        }
      } else {
        res.send({message: "end reached"});
      }
    } catch (error) {
      res.status(500).send({ error: "Internal server error" });
    }
});

router.get('/searchbar', async (req,res) => {
    try {
      const searchbarQuery = req.query.searchbarQuery;
      if(searchbarQuery === "") {res.send([]);}
      else {
      const users = await User.find({});

      let results = users.reduce((listOfSearchKeywords,user) => {
        if (user.profile && user.profile.photoGallery) {
          const userKeywords = user.profile.photoGallery
            .filter((gallery) => gallery.url !== '') 
            .reduce((keywords,gallery) => {         

              const arrayOfKeywords = gallery.keywords.filter((word) => word.toLowerCase().includes(searchbarQuery.toLowerCase()));
              keywords.push(...arrayOfKeywords); 
              return keywords;      
              
            },[]);         

          listOfSearchKeywords.push(...userKeywords);
        }
        return listOfSearchKeywords;
      },[]);

      results = results.filter((item,index) => {
        return results.indexOf(item.toLowerCase()) === index;
      });

      res.send(results);
    }
      
    } catch (error) {
      res.status(500).send({error: "Internal server error"});
    }
    
})

  module.exports = router