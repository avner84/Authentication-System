const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  
  isActive: {
    type: Boolean,
    default: false
  },
  refreshToken: {  
    type: String,
    default: ''
  }
 },
 { timestamps: true }
 );

module.exports = mongoose.model('User', userSchema);
