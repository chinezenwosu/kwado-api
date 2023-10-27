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
const { createServer } = require('http')
const { Server } = require('socket.io')
const SocketProvider = require('./lib/socket.js')
const { verifyClient } = require('./middlewares/clientHeader.js')

const app = express()

connectMongo()
scheduleRedisCron(redis)
const sessionMiddleware = getSessionStore(redis)

const corsOptions = {
  origin: config.url.cors,
  credentials: true,
  optionSuccessStatus: 200,
  methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
}

app.set('trust proxy', 1)
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(config.session.secret))
app.use(sessionMiddleware)
app.use(verifyClient)
app.use('/api', routes)

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: corsOptions,
})
io.engine.use(sessionMiddleware)

SocketProvider.setUp(io)

httpServer.listen(config.url.port, () => {
  console.log(`Kwado is running at ${config.url.domain}`)
})
