import express from 'express'
import KwadocController from '../controllers/Kwadoc.js'
import { isLoggedIn } from '../middlewares/auth.js'

const router = express.Router()
const controller = new KwadocController()

const errorCatcher = function(inputError, res) {
  console.error(inputError)
  res.status(500)
}

router.get('/', async (req, res) => {
  try {
    const kwadocs = await controller.getKwadocs()
    res.json(kwadocs)
  }
  catch(e) {
    errorCatcher(e, res)
  }
})

router.get('/:id', isLoggedIn, async (req, res) => {
  const id = req.params.id

  try {
    const kwadoc = await controller.getKwadocById(id)
    res.json(kwadoc)
  }
  catch(e) {
    errorCatcher(e, res)
  }
})

router.delete('/:id', async (req, res) => {
  const id = req.params.id

  try {
    const kwadoc = await controller.deleteKwadoc(id)
    res.json(kwadoc)
  }
  catch(e) {
    errorCatcher(e, res)
  }
})

router.post('/', async (req, res) => {
  const newData = req.body

  try {
    const kwadoc = await controller.createKwadoc(newData)
    res.json(kwadoc)
  }
  catch(e) {
    errorCatcher(e, res)
  }
})

router.put('/:id', async (req, res) => {
  const id = req.params.id
  const updatedData = req.body

  try {
    const kwadoc = await controller.updateKwadoc(id, updatedData)
    res.json(kwadoc)
  }
  catch(e) {
    errorCatcher(e, res)
  }
})

export default router