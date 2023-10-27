const config = require('../config')

const verifyClient = function (req, res, next) {
	if (!req.header(config.headers.client)) {
		return res.status(401).send('Unauthorized')
	}
	next()
}

exports.verifyClient = verifyClient
