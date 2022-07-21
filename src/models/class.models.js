
const mongoose = require("mongoose");


const classSchema = new mongoose.Schema({
    grade : {type: Number, required:true},
    section : {type: String, required:true},
    subject: [{type: mongoose.Schema.Types.ObjectId, ref:"subject"}],
    numOfStudents : {type: Number, default:0, required:false},
    user : {type: mongoose.Schema.Types.ObjectId, ref:"user", required:true}
},{
    timestamps:true,
    versionKey: false
})

module.exports= mongoose.model("classes", classSchema);
