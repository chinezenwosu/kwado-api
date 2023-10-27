const { createClient } = require('redis')
const config = require('../config')

const redis = createClient({ url: config.redis.url })

redis.on('connect', () => {
	console.log('Connected to Redis')
})

redis.on('error', (err) => {
	console.log('Redis client Error', err)
})

redis.connect()

module.exports = redis
