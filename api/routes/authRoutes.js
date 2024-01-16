const router = require("express").Router();
const User = require('../models/User')
const bcrypt = require('bcrypt');
const passport = require('passport');
//REGISTER USER
router.post("/register", async (req, res) => {

    try {
        //generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //create new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            profilePicture: req.body.profilePicture,
            coverPicture: req.body.coverPicture,
            city: req.body.city,
            relationship: req.body.relationship,
            desc: req.body.desc,
        })

        //save user and responed
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
});

//LOGIN
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json("User not found");
        } else {
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) {
                return res.status(400).json("Wrong Password");
            }
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
});



//google authentication passport




router.get("/login/failed", (req, res) => {
    res.status(401).json({
        success: false,
        message: "failure",
    });
})

router.get("/login/success", (req, res) => {
    if (req.user) {
        console.log(req.user)
        return res.status(200).json(req.user);
    } else{
        return res.status(400).json("User Not found");
    }
})

router.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("https://sociosync.netlify.app");
    // res.redirect("http://localhost:3000");
})

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback",
    passport.authenticate("google", {
        successRedirect: "https://sociosync.netlify.app/"
        // successRedirect: "http://localhost:3000"
    }))



module.exports = router;