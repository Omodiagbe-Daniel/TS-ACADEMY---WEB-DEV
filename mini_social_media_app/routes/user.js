const bcrypt = require("bcrypt");
const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const authentication = require("../middleware/authenticate");
const { findById } = require("../models/post");

const router = express.Router();


router.post("/api/users/register", async(req, res, next) => {
    try {
        const { username, email, password, fullName, dateOfBirth, country } = req.body;
        if (!username || !password || !email || !fullName || !dateOfBirth || !country) {
            return res.status(400).send("Invalid user");
        }
        if (password.length < 8) {
            return res.status(400).send("Password must not be less than 8 characters");
        } else if (password.length > 20) {
            return res.status(400).send("Password must not exceed 20 characters");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            fullName,
            username,
            email,
            dateOfBirth,
            country,
            password: hashedPassword,
        }
        const postUser = await User.create(newUser);
        res.json({ fullName, username, email, dateOfBirth, country, "_id": postUser._id });
    } catch (error) {
        next(error);
    }
})

router.post("/api/users/login", async(req, res, next) => {
    try {
        const { email, password} = req.body;
        const user = await User.findOne({ "email": email });
        if (user) {
            const comparePassword = await bcrypt.compare(password, user.password);
            if (comparePassword) {
                const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h"});
                res.json({"username": user.username, email, "_id": user._id, token});
            } else {
                res.status(401).send("Invalid Password");
            }
            
        } else {
            res.status(401).send("Invalid Password or Inalid Email")
        }
    } catch (error) {
        next(error);
    }
})

router.get("/api/users/profile", authentication, async(req, res, next) => {
    try {
        const profile = await User.findById(req.userId);
        const {_id, fullName, username, email, dateOfBirth, country, profileImage } = profile;
        res.status(200).json({_id, fullName, username, email, dateOfBirth, country, profileImage});
    } catch (error) {
        next(error);
    }
})

router.get("/api/users/profile/:userId", authentication, async(req, res, next) => {
    try {
        const profile = await User.findById(req.params.userId);
        if (!profile) {
            return res.status(404).send("profile not found");
        }
        res.status(200).json({
            fullName: profile.fullName,
            username: profile.username,
            email: profile.email,
            dateOfBirth: profile.dateOfBirth,
            country: profile.country,
            profileImage: profile.profileImage
        })
    } catch (error) {
        next(error);
    }
}) 

router.put("/api/users/profile", authentication, async(req, res, next) => {
    try {
        const {fullName, username, email, dateOfBirth, country, profileImage} = req.body;
        const profile = await User.findById(req.userId);
        const newData = {
            fullName: fullName || profile.fullName,
            username: username || profile.username,
            email: email || profile.email,
            dateOfBirth: dateOfBirth || profile.dateOfBirth,
            country: country || profile.country,
            profileImage: profileImage || profileImage
        };
        const newProfile = await User.findByIdAndUpdate(req.userId, newData, {new: true});
        res.status(200).json({
            fullName: newProfile.fullName,
            username: newProfile.username,
            email: newProfile.email,
            dateOfBirth: newProfile.dateOfBirth,
            country: newProfile.country,
            profileImage: profileImage || profile.profileImage
        });
    } catch (error) {
        next(error);
    }
})


module.exports = router;