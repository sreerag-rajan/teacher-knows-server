require("dotenv").config();
const express = require("express");
const {body, validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs')

const User = require("../models/user.model");
const Token = require('../models/token.model')

const router = express.Router();

const newToken = (user)=>{
  return jwt.sign({user}, process.env.JWT_SECRET_KEY);
}

router.post("/register",
	body("firstName").notEmpty().withMessage("This field cannot be empty"),
	body("lastName").notEmpty().withMessage("This field cannot be empty"),
	body("email").isEmail().withMessage("Needs to be a valid email"),
	// body("password").isStrongPassword().withMessage("The character should be 8 characters long atleast"),
	async (req, res)=>{
	try{
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		let user = await User.findOne({"email":req.body.email})
		if(user){
			return res.status(400).json({error: "Email in use"});
		}

		user = await User.create(req.body);
		const token = newToken(user);
		let payload = {
			id: user._id,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			isVerified: user.isVerified,
		}
		return res.status(200).json({user:payload, token});
  }
	catch(er){
		console.error('ERROR ::: register ::: ', er)
		return res.status(500).json({error: er.message});
	}
}) 

router.post("/login",
	body("email").isEmail().withMessage("Needs to be a valid email"),
	// body("password").isStrongPassword().withMessage("The character should be 8 characters long atleast"),
	async (req, res)=>{
	try{
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
				return res.status(400).json({ errors: errors.array() });
		}
		let user = await User.findOne({email: req.body.email}).lean().exec();
		if(!user) return res.status(400).json({error: "Incorrect Email or Password"});

		// const match = user.checkPassword(req.body.password);
		const match = bcrypt.compareSync(req.body.password, user.password);
		if(!match) return res.status(400).json({error: "Incorrect Email or Password"});

		await User.findByIdAndUpdate(user._id,{lastLogin: Date.now()})
		const token = newToken(user);
		let payload = {
				id: user._id,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				isVerified: user.isVerified,
		}
		return res.status(201).send({user:payload, token});
  }
	catch(er){
		console.error('ERROR ::: login ::: '. er)
		return res.status(500).send(er.message);
	}
}) 

//For the time being commented out
// router.post("/check-entity-availability", async (req,res)=>{
//     try{
//         console.log('hitting this route')
//         let user = await User.findOne({email: req.body.email});
//         if(user){
//             return res.status(400).json({msg: 'USER EXISTS'})
//         }
//         else{
//             return res.status(200).json({msg: 'No issues'})
//         }
//     }
//     catch(er){
//         console.error('ERROR ::: checkEntityAvailablity ::: ', er);
//         return res.status(500).json({error: er});
//     }
// })
router.post('/reset-password', async (req,res)=>{
	try{
		let token = await Token.findById(req.body.token).lean().exec();
		if(!token){
			return res.status(400).json({error: "NO TOKEN FOUND"});
		}
		let user = await User.findByIdAndUpdate(token.user, {password:bcrypt.hashSync(req.body.password, 8)}, {new:true}).lean().exec();
		if(!user) return res.status(400).json({error:"No User Found"})
		let payload = {
			id: user._id,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			isVerified: user.isVerified,
		}
		return res.status(200).json({user:payload})

	}
	catch(err){
		console.error('ERROR ::: reset-password :::', err);
		return res.status(500).json({error: err.message})
	}
})
module.exports = router;