import mongoose from 'mongoose'
import { config } from '../config.js'

const connectMongo = () => {
  mongoose.connect(`${config.mongodb.url}/${config.mongodb.name}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB")
  })
  .catch((err) => {
    console.log("Unable to connect to MongoDB", err)
  })
}

export { connectMongo }
