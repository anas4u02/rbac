const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const createHttpError = require('http-errors')
const { roles } = require('../utils/constants')

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: [roles.admin, roles.developer, roles.inbox],
    default: roles.inbox
  }
});


// Hash the plain text password before saving
UserSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
      // deciding roles
      // if (this.email === process.env.ADMIN_EMAIL.toLowerCase()) {
      //   this.role = roles.admin
      // }
      if (this.email === ADMIN_EMAIL.toLowerCase()) {
        this.role = roles.admin
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw createHttpError.InternalServerError(error.message);
  }
};

const User = mongoose.model('user', UserSchema)
module.exports = User



// eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcHAiLCJzdWIiOiIxNjk5OTM3IiwiYXVkIjoiV0VCIiwiaWF0IjoxNzA3NTM1NTQzLCJleHAiOjE3MTAxMjc1NDN9.QD01-6Rl4oSeXBjC3vX8-w6wmGX_IrUmtft_oi8pBHY
