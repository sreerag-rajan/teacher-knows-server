const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
    name : {type: String, required: true},
    user_id : {type: mongoose.Schema.Types.ObjectId, ref: "user", required:true}
},
{
    timestamps: true
})

module.exports = mongoose.model("subject", subjectSchema);