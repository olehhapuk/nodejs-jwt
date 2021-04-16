const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    require: true,
  },
  updatedAt: {
    type: Date,
    default: null,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    require: true,
  },
});

module.exports = mongoose.model('User', UserSchema);
