const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    rollNumber : {type: String, required: true},
    firstName : {type: String, required:true},
    lastName: {type: String, required:false},
    gender: {type: String, enum:['MALE','FEMALE','OTHER','NOT DISCLOSED'], default:'NOT DISCLOSED', required: false},
    studentEmail:{type:String, required:false},
    parentEmail: {type:String, required:false},
    classId: {type: mongoose.Schema.Types.ObjectId, ref:"classes", required:true},
    user : {type: mongoose.Schema.Types.ObjectId, ref:"user", required:true}
},{
    timestamps:true,
    versionKey: false
})

module.exports = mongoose.model("student", studentSchema);