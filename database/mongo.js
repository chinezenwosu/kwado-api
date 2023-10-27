const mongoose = require('mongoose')
const config = require('../config.js')

const connectMongo = () => {
	mongoose
		.connect(`${config.mongodb.url}/${config.mongodb.name}`, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(() => {
			console.log('Connected to MongoDB')
		})
		.catch((err) => {
			console.log('Unable to connect to MongoDB', err)
		})
}

exports.connectMongo = connectMongo
