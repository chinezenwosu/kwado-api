const express = require('express')
const { isLoggedIn } = require('../middlewares/auth.js')
const KwadocController = require('../controllers/Kwadoc.js')
const UserController = require('../controllers/User.js')
const Kwadoc = require('../models/Kwadoc.js')

const router = express.Router()
const controller = new KwadocController()
const userController = new UserController()

const errorCatcher = function (inputError, res) {
	console.error(inputError)
	res.status(500)
}

router.get('/', async (req, res) => {
	try {
		const user = await userController.getUserById(req.session.user, {
			path: 'kwadocs',
			options: { sort: { updatedAt: -1 } },
		})
		res.json(user.kwadocs)
	} catch (e) {
		errorCatcher(e, res)
	}
})

router.get('/:slug', isLoggedIn, async (req, res) => {
	const slug = req.params.slug

	try {
		const kwadoc = await controller.getKwadocBy('slug', slug)
		res.json(kwadoc)
	} catch (e) {
		errorCatcher(e, res)
	}
})

router.delete('/:id', async (req, res) => {
	const id = req.params.id

	try {
		const kwadoc = await controller.deleteKwadoc(id)
		res.json(kwadoc)
	} catch (e) {
		errorCatcher(e, res)
	}
})

router.post('/', isLoggedIn, async (req, res) => {
	const userId = req.session.user
	const newData = { ...{ author: userId }, ...req.body }

	try {
		controller.transaction(async () => {
			const role = Kwadoc.userRoles.EDITOR
			const kwadoc = await controller.createKwadoc(newData)
			await controller.addUserToKwadoc(kwadoc, userId, role)
			await userController.addKwadocToUser(userId, kwadoc)
			res.json(kwadoc)
		})
	} catch (e) {
		errorCatcher(e, res)
	}
})

router.put('/:id', async (req, res) => {
	const id = req.params.id
	const updatedData = req.body

	try {
		const kwadoc = await controller.updateKwadoc(id, updatedData)
		res.json(kwadoc)
	} catch (e) {
		errorCatcher(e, res)
	}
})

module.exports = router
