import { createClient as redisClient } from 'redis'

const redis = redisClient()

redis.on('connect', () => {
  console.log('connected to Redis')
})

redis.on('error', (err) => {
  console.log('Redis client Error', err)
})

await redis.connect()

export { redis }