const bcrypt = require('bcrypt')
const User = require('../models/User.js')

const handleError = (e) => {
  return {
    error: e,
    code: 500,
  }
}

class UserController {
  async getUserById (id) {
    try {
      const user = await User.findById(id)
      return { user }
    }
    catch (e) {
      handleError(e)
    }
  }

  async verifyLoginCredentials ({ email, password }) {
    if (email && password) { 
      try {
        const existingUser = await User.findOne({ email }).select('password')
  
        if (existingUser) {
          const match = await bcrypt.compare(password, existingUser.password)
  
          if (match) {
            return {
              allowLogin: match,
              user: existingUser,
            }
          }

          // Invalid password
          return {
            allowLogin: false,
            error: 'Invalid email or password',
            code: 400,
          }
        }

        // User with that email does not exist
        return {
          allowLogin: false,
          error: 'Invalid email or password',
          code: 400,
        }
      }
      catch (e) {
        handleError(e)
      }
    } else {
      return {
        allowLogin: false,
        error: 'Please fill in all the fields.',
        code: 400,
      }
    }
  }

  async signUp (userData) {
    const { firstName, lastName, email, password } = userData
  
    if (firstName && lastName && email && password) {
      try {
        const existingUser = await User.findOne({ email })
  
        if (!existingUser) {
          const hashedPassword = bcrypt.hashSync(password, 10)
          const newUser = new User({
              firstName,
              lastName,
              email,
              password: hashedPassword,
          })
  
          const user = await newUser.save()
  
          return {
            allowLogin: true,
            user,
          }
        } else {
          return {
            allowLogin: false,
            error: 'User with that email already exists.',
            code: 409,
          }
        }
      }
      catch (e) {
        handleError(e)
      }
    } else {
      return {
        allowLogin: false,
        error: 'Please fill in all the fields.',
        code: 400,
      }
    }
  }
}

module.exports = UserController
