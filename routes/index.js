import express from 'express'
import kwadocRouter from './kwadoc.js'
import userRouter from './user.js'

const router = express.Router()

router.use('/kwadocs', kwadocRouter)
router.use('/users', userRouter)

export default router
