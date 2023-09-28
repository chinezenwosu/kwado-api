const redis = require('../database/redis.js')
const KwadocController = require('../controllers/Kwadoc.js')
const { getDocumentHash } = require('../utils.js')

const loadDocument = async slug => {
  // fetch from redis first
  try {
    let document =  await redis.hGet(getDocumentHash(slug), 'content')

    if (document) {
      return JSON.parse(document)
    }

    const controller = new KwadocController()
    document = await controller.getKwadocBy('slug', slug)
    return document?.content
  }
  catch(e) {
    console.log('Document load error', e)
  }

  return null
}

const saveToCache = async (slug, doc) => {
  await redis.hSet(getDocumentHash(slug), 'content', JSON.stringify(doc))
  await redis.hSet(getDocumentHash(slug), 'updatedAt', Date.now())
}

const socketEmissions = {
  GET_DOCUMENT: 'GET_DOCUMENT',
  LOAD_DOCUMENT: 'LOAD_DOCUMENT',
  SEND_DOCUMENT_CONTENT_CHANGES: 'SEND_DOCUMENT_CONTENT_CHANGES',
  RECEIVE_DOCUMENT_CONTENT_CHANGES: 'RECEIVE_DOCUMENT_CONTENT_CHANGES',
}

const setupWSConnection = (socket) => {
  socket.on(socketEmissions.GET_DOCUMENT, async (documentId) => {
    const data = await loadDocument(documentId)
    socket.join(documentId)
    socket.emit(socketEmissions.LOAD_DOCUMENT, data)
    
    socket.on(socketEmissions.SEND_DOCUMENT_CONTENT_CHANGES, (data) => {
      socket.broadcast.to(documentId).emit(socketEmissions.RECEIVE_DOCUMENT_CONTENT_CHANGES, data)
      saveToCache(documentId, data.payload.data)
    })
  })
}

const setUpWebsocketProvider = (io) => {
  io.on('connection', setupWSConnection)
}

exports.setUpWebsocketProvider = setUpWebsocketProvider
