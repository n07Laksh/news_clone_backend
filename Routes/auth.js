const express = require("express");
const User = require("../Model/Users")
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const router = express.Router();
const getUser = require("../Middleware/getUser")

const secret_key = process.env.JWT_SECRET_KEY;

// router 1 for creating user using POST method and route /api/auth/signup no login require
router.post("/signup", [
    // express validation requirement field
    body("name", "Please fill the name field").isLength({ min: 1 }),
    body("email", "please fill the email field").isEmail(),
    body("password", "Password minimum 8 character").isLength({ min: 8 }),
], async (req, res) => {

    // express validation result
    const error = validationResult(req)
    // if error is accured then
    if (!error.isEmpty()) {
        return res.status(400).json({ error: true, message: error });
    }

    try {
        let user = await User.findOne({ email: req.body.email }).select("-password -_id -__v -name")
        if (user) { return res.status(400).json({ error: true, message: "User Already exit Please login" }) }

        const { name, password, email } = req.body;

        // bcrypt password for security
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        user = await User.create({
            name: name,
            email: email,
            password: hashedPassword,
        })

        // jwt authentication
        const data = {
            user: {
                id: user._id,
            }
        }
        const jwtoken = jwt.sign(data, secret_key);

        return res.status(201).json({ error: false, message: "User Created Successfully", user: jwtoken })

    } catch (error) {
        return res.status(401).json({ error: true, message: error })
    }

});


//router 2 for getting/login user using POST method and route /api/auth/login no login require
router.post("/login", [
    // express validation requirement field
    body("email", "please fill the email field").isEmail(),
    body("password", "Password minimum 8 character").isLength({ min: 8 }),
], async (req, res) => {

    // express validation result
    const error = validationResult(req)
    // if error is accured then
    if (!error.isEmpty()) {
        return res.status(400).json({ error: true, message: error });
    }

    try {
        const { email, password } = req.body;

        let user = await User.findOne({ email: email }).select("-name -__v");
        // if user not exitst in db
        if (!user) {
            return res.status(500).json({ error: true, message: "Please use the correct values email" });
        }

        const comparePass = await bcrypt.compare(password, user.password);
        if (!comparePass) {
            return res.status(400).json({ error: true, message: "Please use the correct values password" });
        }

        // jwt authentication
        const data = {
            user: {
                id: user._id,
            }
        }
        const jwtoken = jwt.sign(data, secret_key);

        return res.status(201).json({ error: false, message: "User Fetch Successfully", user: jwtoken })

    } catch (error) {
        return res.status(400).json({ error: true, message: error })
    }

});


//router 3 for get the user using POST method and with middleware function route /api/auth/getuser login require 
router.post("/getuser", getUser, async(req, res) => {
    try {
        
        let user = await User.findById(req.userId.id).select("-password");

        return res.status(201).json({ error: false, message: "User Fetch Successfully", user: user });
        

    } catch (error) {
        return res.status(400).json({ error: true, message: error })
    }
})

module.exports = router;