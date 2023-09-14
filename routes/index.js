const express = require('express')
const kwadocRouter = require('./kwadoc.js')
const userRouter = require('./user.js')

const router = express.Router()

router.use('/kwadocs', kwadocRouter)
router.use('/users', userRouter)

module.exports = router
