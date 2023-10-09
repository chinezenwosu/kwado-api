const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
  },
  username: {
    type: String,
    unique: [true, 'Username has already been taken'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    index: true,
    lowercase: true,
    unique: [true, 'Email has already been taken'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false,
  },
}, {
  timestamps: true,
})

const User = model('User', userSchema)
module.exports = User
