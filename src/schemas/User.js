const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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

UserSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();

  this.set({
    updatedAt: Date.now(),
  });

  if (!update.password) {
    next();
    return;
  }

  const hashedPassword = await bcrypt.hash(
    update.password,
    Number(process.env.SALT_ROUNDS)
  );

  update.password = hashedPassword;

  next();
});

UserSchema.pre('save', async function (next) {
  console.log('save');

  const hashedPassword = await bcrypt.hash(
    this.get('password'),
    Number(process.env.SALT_ROUNDS)
  );

  this.set({
    password: hashedPassword,
  });

  next();
});

module.exports = mongoose.model('User', UserSchema);
