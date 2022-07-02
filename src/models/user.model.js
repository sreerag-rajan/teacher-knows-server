const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    firstName: {type: String, required:true},
    lastName: {type: String, required:true},
    email: {type: String, required:true, unique:true},
    password : {type: String, required:true},
    lastLogin : {type: Date, required: true, default: Date.now()},
    role : {type: String, enum:['ADMIN', 'TEACHER', 'STUDENT'], default:'TEACHER'},
    verified: {type: Boolean, default: false},
},
{
    versionKey: false,
    timestamps: true
})


userSchema.pre("save", function(next){
    if(!this.isModified("password")) return next();

    var hash = bcrypt.hashSync(this.password, 8);
    this.password = hash;
    return next();
})

userSchema.methods.checkPassword = function (password){
    return bcrypt.compareSync(password, this.password);
}

const User = mongoose.model("user",userSchema);
module.exports = User;