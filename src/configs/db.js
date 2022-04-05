require("dotenv").config()
const mongoose = require("mongoose");

const connect = async ()=>{
    try{
       await mongoose.connect(process.env.MONGODB_URL);
       console.log("Mongo connected"); 

    }
    catch(er){
        console.log("Mongo error:",er.message)
    }

}

module.exports = connect;