const { createClient } = require('redis')

const redis = createClient()
  
redis.on('connect', () => {
  console.log('Connected to Redis')
})

redis.on('error', (err) => {
  console.log('Redis client Error', err)
})

redis.connect()

module.exports = redis