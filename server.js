import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { SocketIOConnection } from '@slate-collaborative/backend';
import mongoRouter from './database/router.js';
import { MongoClient } from 'mongodb';

const app = express();
let server;

const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  optionSuccessStatus: 200
}
app.use(cors(corsOptions));
app.use(express.json())

app.get("/message", (req, res) => {
  res.json({ message: "Hello from server!" });
});

const url = process.env.MONGO_CONNECTION_URI;

MongoClient.connect(url)
  .then((client) => {
    const db = client.db('kwado');
    const docsCollection = db.collection('kwadocs');
    const docsRouter = mongoRouter(docsCollection);
  
    app.use('/api/kwadocs', docsRouter); // Defining the base route where we can later access our data
  })
  .catch(console.err);

server = app.listen(process.env.PORT, () => {
  console.log(`Kwado is running at localhost:${process.env.PORT}`);
});

const config = {
  entry: server, // or specify port to start io server
  defaultValue: [],
  saveFrequency: 2000,
  onAuthRequest: async (query, socket) => {
    // some query validation
    return true
  },
  onDocumentLoad: async pathname => {
    try {
      const documentRes = await fetch(`http://localhost:8000/api/kwadocs${pathname}`)
      const document = await documentRes.json()

      if (document) {
        return document.content
      }
    }
    catch(e) {
      console.log('Document load error', e)
    }

    return null
  },
  onDocumentSave: async (pathname, doc) => {
    // save document
  }
}

new SocketIOConnection(config);

