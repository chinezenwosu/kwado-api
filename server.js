require('dotenv/config')
const cors = require('cors')
const express = require('express')
const config = require('./config.js')
const routes = require('./routes/index.js')
const redis = require('./database/redis.js')
const cookieParser = require('cookie-parser')
const { connectMongo } = require('./database/mongo.js')
const { scheduleRedisCron } = require('./cron/redis.js')
const { getSessionStore } = require('./database/session.js')
const { wss, setUpWebsocketProvider } = require('./helpers/socketIO.js')

const app = express()

scheduleRedisCron(redis)
connectMongo()

const corsOptions = {
  origin: config.url.cors,
  credentials: true,
  optionSuccessStatus: 200,
  methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(config.session.secret))
app.use(getSessionStore(redis))
app.use('/api', routes)

const server = app.listen(config.url.port, () => {
  console.log(`Kwado is running at ${config.url.domain}`)
})

setUpWebsocketProvider()

server.on('upgrade', (request, socket, head) => {
  const handleAuth = ws => {
    wss.emit('connection', ws, request)
  }
  wss.handleUpgrade(request, socket, head, handleAuth)
})
