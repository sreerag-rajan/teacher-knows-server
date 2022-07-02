const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  token: {type: String, required: true},
  user: {type: mongoose.Schema.Types.ObjectId, ref:"user", required: true},
  type: {type: String, enum:['REGISTER', 'PASSWORD_RESET'], default:'REGISTER'},
  creationTime: {type: Date, default: Date.now()},
  expiryDate : {type:Date, default: Date.now()+900000}
},{
  timestamps: true,
  versionKey: false
})

module.exports = mongoose.model('token', tokenSchema);