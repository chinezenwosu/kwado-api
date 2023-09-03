import bcrypt from 'bcrypt'
import User from '../models/User.js'

const handleError = (e) => {
  throw new Error(e)
}

class UserController {
  async getUserById (id) {
    try {
      const user = await User.findById(id)
      return user
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
            return { allowLogin: match, user: existingUser }
          }
          return { allowLogin: false, error: 'Invalid password' }
        }
        return {
          allowLogin: false,
          error: 'User with that email does not exist.'
        }
      }
      catch (e) {
        handleError(e)
      }
    } else {
      return {
        allowLogin: false,
        error: 'Please fill in all the fields.',
      }
    }
  }

  async signUp (userData) {
    const { firstName, lastName, email, password } = userData
  
    if (firstName && lastName && email && password) {
      try {
        const existingUser = await User.findOne({ email })
  
        if (!existingUser) {
          const hashedPassword = bcrypt.hashSync(password, 10);
          const newUser = new User({
              firstName,
              lastName,
              email,
              password: hashedPassword,
          });
  
          const user = await newUser.save()
  
          return {
            allowLogin: true,
            user,
          }
        } else {
          return {
            allowLogin: false,
            error: 'User with that email already exists.',
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
      }
    }
  }
}

export default UserController
