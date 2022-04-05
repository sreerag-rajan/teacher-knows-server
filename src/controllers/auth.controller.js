require("dotenv").config();
const express = require("express");
const {body, validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");

const User = require("../models/user.model");

const router = express.Router();

const newToken = (user)=>{
    return jwt.sign(user, process.env.JWT_SECRET_KEY);
}

router.post("/register",
    body("first_name").notEmpty().withMessage("This field cannot be empty"),
    body("last_name").notEmpty().withMessage("This field cannot be empty"),
    body("email").isEmail().withMessage("Needs to be a valid email"),
    body("password").isStrongPassword().withMessage("The character should be 8 characters long atleast"),
    async (req, res)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let user = await User.findOne({"email":req.body.email})
        if(user){
            return res.status(400).send("Email in use");
        }

        user = await User.create(req.body);
        const token = newToken(user);
        return res.status(201).send({user, token});
    }
    catch(er){
        return res.status(500).send(er.message);
    }
}) 

router.post("/login",
    body("email").isEmail().withMessage("Needs to be a valid email"),
    body("password").isStrongPassword().withMessage("The character should be 8 characters long atleast"),
    async (req, res)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let user = await User.findOne({email: req.body.email}).lean().exec();
        if(!user) return res.status(400).send("Incorrect Email or Password");

        const match = user.checkPassword(req.body.password);
        if(!match) return res.status(400).send("Incorrect Email or Password");

        const token = newToken(user);
        return res.status(201).send({user, token});
        //return res.status(210).redirect(/:userid/dashboard);

    }
    catch(er){
        return res.status(500).send(er.message);
    }
}) 

module.exports = router;