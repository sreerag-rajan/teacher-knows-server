const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
    name : {type: String, required: true},
    user : {type: mongoose.Schema.Types.ObjectId, ref: "user", required:true}
},
{
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model("subject", subjectSchema);