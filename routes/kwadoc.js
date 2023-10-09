const express = require('express')
const KwadocController = require('../controllers/Kwadoc.js')
const { isLoggedIn } = require('../middlewares/auth.js')

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

router.get('/:slug', isLoggedIn, async (req, res) => {
  const slug = req.params.slug
  
  try {
    const kwadoc = await controller.getKwadocBy('slug', slug)
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

router.post('/', isLoggedIn, async (req, res) => {
  const newData = { ...{ author: req.session.user }, ...req.body }

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

module.exports = router
