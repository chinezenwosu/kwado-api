const bcrypt = require('bcrypt')
const User = require('../models/User.js')
const BaseController = require('./index.js')

const handleError = (e) => {
  return {
    error: e,
    code: 500,
  }
}

class UserController extends BaseController {
  async getUserById(id, populations) {
    try {
      return await User.findById(id).populate(populations)
    } catch (e) {
      return handleError(e)
    }
  }

  async addKwadocToUser(id, kwadoc) {
    return User.findByIdAndUpdate(
      id,
      {
        $push: {
          kwadocs: kwadoc,
        },
      },
      { new: true, useFindAndModify: false },
    )
  }

  async verifyLoginCredentials({ email, password }) {
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
      } catch (e) {
        return handleError(e)
      }
    } else {
      return {
        allowLogin: false,
        error: 'Please fill in all the fields.',
        code: 400,
      }
    }
  }

  async signUp(userData) {
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
      } catch (e) {
        return handleError(e)
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
