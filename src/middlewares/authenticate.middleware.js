require("dotenv").config()
const jwt = require("jsonwebtoken");


const verifyToken = function(token){
    return new Promise((resolve, reject)=>{
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err,user)=>{
            if(err) return reject(err);

            resolve(user);
        });
    });
};

module.exports = async (req,res,next)=>{
    if(!req.headers.authorization) return res.status(400).send({message: "authorization token was not provided or is invalid"});

    if(!req.headers.authorization.startsWith("Bearer ")) return res.status(400).send({message: "authorization token was not provided or is invalid"});

    let token = req.headers.authorization.split(" ")[1];

    let user;
    try{
        user = await verifyToken(token);
    }
    catch(er){
        return res.status(400).send({message: "authorization token was not provided or is invalid"}); 
    }

    req.body.user = user.user._id;

    return next();
}