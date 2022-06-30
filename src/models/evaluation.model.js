const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
    name:{type:String, require: true},
    questions: [{type:Number}]
})

const markperqSchema = new MongooseSchema({
    questionNum: {type:Number, required:true},
    marks : {type:Number, required:true}
})

const evaluationSchema = new mongoose.Schema({
    name : {type:String, required:true},
    date :{type: Date, required:true},
    subjects: [{type: mongoose.Schema.Types.ObjectId, ref: "subject"}],
    numOfQuestions: {type:Number, required:true},
    choicesBtwQuestions: {type: Boolean, required:true},
    maxMarks:{type:Number, required: true},
    topics: [topicSchema],
    marksPerQuestion: [markperqSchema],
    classes: [{type:mongoose.Schema.Types.ObjectId, ref:'classes'}]
})


module.exports = mongoose.model("evaluation", evaluationSchema);