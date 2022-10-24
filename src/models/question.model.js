const mongoose = require(mongoose);

const questionSchema = new mongoose.Schema({
  number: {type: String, required: true},
  evaluationId: {type: mongoose.Schema.Types.ObjectId, ref:'evaluation'},
  maxMarks: {type: Number, required:true},
  isOptional : {type: Boolean, required: true, default: false},
  choicePool : [{type: mongoose.Schema.Types.ObjectId, ref:'question'}],
});

module.exports = mongoose.model('question',questionSchema)