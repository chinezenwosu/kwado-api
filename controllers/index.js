const { startSession } = require('mongoose')

class BaseController {
	async transaction(transactionCallback) {
		const session = await startSession()
		session.startTransaction()

		await transactionCallback()

		session.commitTransaction()
		session.endSession()
	}
}

module.exports = BaseController
