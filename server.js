import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { SocketIOConnection } from '@slate-collaborative/backend'
import docsRouter from './routes/kwadoc.js'
import { redis } from './database/redis.js'
import { scheduleRedisCron } from './cron/redis.js'
import { config } from './database/config.js'
import {
  onDocumentLoad,
  onDocumentSave,
  onAuthRequest
} from './helpers/socketIO.js'

const app = express()
scheduleRedisCron(redis)
mongoose.connect(`${config.mongodb.url}/${config.mongodb.name}`)

const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  optionSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(express.json())
app.use('/api/kwadocs', docsRouter)

const server = app.listen(process.env.PORT, () => {
  console.log(`Kwado is running at localhost:${process.env.PORT}`)
})

const socketIoConfig = {
  entry: server, // or specify port to start io server
  defaultValue: [],
  saveFrequency: 2000,
  onAuthRequest,
  onDocumentLoad,
  onDocumentSave,
}

new SocketIOConnection(socketIoConfig)

