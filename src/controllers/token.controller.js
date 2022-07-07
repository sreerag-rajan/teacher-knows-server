require('dotenv').config()
const generate = require('nanoid/generate');
const router = require('express').Router();

const Token = require('../models/token.model');
const User = require('../models/user.model');
const mailer  = require("../services/mail.service");


router.post('/create-token', async (req, res) =>{
  try{
    const user = await User.findOne({email:req.body.user}).lean().exec()
    if(user){
      const token = await Token.create({
        user,
        token: generate('1234567890', 6),
        type: req.body.type
      });

      await mailer({
        to: user.email,
        from: process.env.MAIL_FROM,
        subject: req.body.type==="REGISTER"?"User Registration Verification Token":"Forgot Password Verification Token",
        text:`Your Verficiation token is ${token.token}`,
        html: `
          <h1>Verification Token for Teacher Knows</h1>
          <p>Verification code is ${token.token}</p>
        `
      });
      return res.status(200).send({msg:'Token has been sent to your email', user});
    }
    else{
      return res.status(400).json({msg: "No user information detected"})
    }
  }
  catch(er){
    console.error("ERROR ::: create-registration-token route :::", er);
    return res.status(500).json({error: er});
  }
})

router.post('/verify-token', async (req, res) =>{
  try{
    const token = await Token.findOne({token: req.body.token}).lean().exec();
    if(token){
      let user;
      if(req.body.type==="REGISTER"){
        user = await User.findByIdAndUpdate(token.user,{isVerified: true}, {new: true}).lean().exec();
        await mailer({
          to: user.email,
          from:'tkAdmin@yopmail.com',
          subject: 'Welcome to TK',
          text : `Hello ${user.firstName} ${user.lastName} \n Welcome to Teacher Knows! \n We hope this platform helps you better understand your students and their performance and help guide them better`,
          html: `<h1>Welcome to Teacher Knows</h1>
                  <p>We hope this platform helps you better understand your students and their performance and help guide them better</p>`             
        }).catch(console.error)
      }
      else{
        user = await User.findById(token.user).lean().exec()
      }
      let payload = {
				id: user._id,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
        isVerified: user.isVerified,
		}
      return res.status(200).send({status:200, msg: "Token Successfully Verified", user:payload, token})
    }
    else{
      return res.status(400).send({status:400, msg: "Incorrect Token"})
    }

  }
  catch(er){
    console.error("ERROR ::: verify-token route :::", er);
    return res.status(500).json({error: er});
  }
})


module.exports = router