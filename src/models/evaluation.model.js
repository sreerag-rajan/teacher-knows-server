const mongoose = require("mongoose");


const evaluationSchema = new mongoose.Schema({
    name : {type:String, required:true},
    dateOfEvaluation :{type: Date, required:true},
    subjects: [{type: mongoose.Schema.Types.ObjectId, ref: "subject"}],
    totalNumberOfQuestions: {type:Number, required:true},
    isChoicesBtwQuestions: {type: Boolean, required:true},
    requiredNumberOfQuestions: {type: Number},
    maxMarks:{type:Number, required: true},
    passingMarks: {type:Number},
    topics: [{type: String}],
    questions: [{type: mongoose.Schema.type.ObjectId, ref:'question'}],
    classes: [{type:mongoose.Schema.Types.ObjectId, ref:'classes'}],
    user: {type: mongoose.Schema.Types.ObjectId, ref:'user'},
})


module.exports = mongoose.model("evaluation", evaluationSchema);