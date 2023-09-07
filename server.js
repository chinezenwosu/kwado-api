import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { SocketIOConnection } from '@slate-collaborative/backend'
import routes from './routes/index.js'
import redis from './database/redis.js'
import { scheduleRedisCron } from './cron/redis.js'
import { connectMongo } from './database/mongo.js'
import { getSessionStore } from './database/session.js'
import { config } from './config.js'
import {
  onDocumentLoad,
  onDocumentSave,
  onAuthRequest
} from './helpers/socketIO.js'

const app = express()

scheduleRedisCron(redis)
connectMongo()

const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001'],
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

const server = app.listen(process.env.PORT, () => {
  console.log(`Kwado is running at localhost:${process.env.PORT}`)
})

const socketIoConfig = {
  entry: server, // or specify port to start io server
  defaultValue: [],
  saveFrequency: 2000,
  onAuthRequest,
  onDocumentLoad: async (pathname) => await onDocumentLoad(pathname),
  onDocumentSave: async (pathname, doc) => await onDocumentSave(pathname, doc),
}

new SocketIOConnection(socketIoConfig)

