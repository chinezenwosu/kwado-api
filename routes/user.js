import express from 'express'
import UserController from '../controllers/User.js'
import { stripModel } from '../utils.js'

const router = express.Router()
const controller = new UserController()

const errorCatcher = (error, res, statusCode = 500) => {
  console.error(error)
  res.status(statusCode).send(error)
}

router.get('/session', async (req, res) => {
  if (req.session.user) { 
    let { user } = await controller.getUserById(req.session.user)

    if (user) {
      res.json({
        user: stripModel(user),
        isLoggedIn: true,
      })
    }
  } else {
    res.json({
      isLoggedIn: false,
    })
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const { allowLogin, user, error, code } = await controller.verifyLoginCredentials({
      email,
      password,
    })

    if (allowLogin) {
      req.session.user = user._id
      req.session.save(function (err) {
        if (!err) {
          res.json({
            isLoggedIn: true,
          })
        }
      })
    } else {
      errorCatcher(error, res, code)
    }
  }
  catch(e) {
    errorCatcher(e, res, e.statusCode)
  }
})

router.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password } = req.body

  try {
    const { allowLogin, error, user, code } = await controller.signUp({
      firstName,
      lastName,
      email,
      password,
    })

    if (allowLogin) {
      req.session.user = user._id
      req.session.save(function (err) {
        if (!err) {
          res.json({
            isLoggedIn: true,
          })
        }
      })
    } else {
      errorCatcher(error, res, code)
    }
  }
  catch(e) {
    errorCatcher(e, res, e.statusCode)
  }
})

router.post('/logout', async (req, res) => {
  req.session.user = null
  req.session.destroy()

  res.json({
    isLoggedIn: false,
  })
})

export default router
