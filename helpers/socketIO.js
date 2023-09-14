const WebSocket = require('ws')
const config = require('../config.js')
const redis = require('../database/redis.js')
const KwadocController = require('../controllers/Kwadoc.js')
const { toSharedType } = require('slate-yjs')
const { getDocumentHash } = require('../utils.js')
const { WebsocketProvider } = require('y-websocket')
const { setPersistence, setupWSConnection } = require('y-websocket/bin/utils')

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

const saveDocument = async (pathname, doc) => {
  const key = pathname.slice('1')
  await redis.hSet(getDocumentHash(key), 'content', JSON.stringify(doc));
  await redis.hSet(getDocumentHash(key), 'updatedAt', Date.now());
}

const wss = new WebSocket.Server({ noServer: true })
wss.on('connection', setupWSConnection)

const setUpWebsocketProvider = () => {
  setPersistence({
    provider: WebsocketProvider,
    bindState: (slug, doc) => {
      doc.on('update', (_update, _origin, yDoc) => {
        const doc = yDoc.getArray('content').toJSON()
        console.log('json save -----------------', JSON.stringify(doc))
      })
  
      const sharedType = doc.getArray('content')
      const provider = new WebsocketProvider(`ws://${config.url.domain}`, slug, doc, {
        connect: false,
        WebSocketPolyfill: require('ws'),
      })
  
      provider.on('sync', async (isSynced) => {
        if (isSynced && sharedType.length === 0) {
          const document = await loadDocument(slug)
  
          if (document) {
            toSharedType(sharedType, document)
          }
        }
      })
  
      provider.on('connection-error', (error) => {
        console.log('Websocket provider connection error', error.message)
      })
  
      provider.connect()
    },
    writeState: (string, doc) => {
      // This is called when all connections to the document are closed.
      return new Promise(resolve => {
        // When the returned Promise resolves, the document will be destroyed.
        // So make sure that the document really has been written to the database.
        resolve()
      })
    }
  })
}

exports.setUpWebsocketProvider = setUpWebsocketProvider
exports.wss = wss
