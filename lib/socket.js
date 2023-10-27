const EditorProvider = require('./editor.js')

const socketEmissions = {
  GET_DOCUMENT: 'GET_DOCUMENT',
  LOAD_DOCUMENT: 'LOAD_DOCUMENT',
  SEND_DOCUMENT_CONTENT_CHANGES: 'SEND_DOCUMENT_CONTENT_CHANGES',
  RECEIVE_DOCUMENT_CONTENT_CHANGES: 'RECEIVE_DOCUMENT_CONTENT_CHANGES',
  SEND_DOCUMENT_SELECTION: 'SEND_DOCUMENT_SELECTION',
  RECEIVE_DOCUMENT_SELECTION: 'RECEIVE_DOCUMENT_SELECTION',
  CLIENT_DISCONNECTED: 'CLIENT_DISCONNECTED',
}

const SocketProvider = (function () {
  const setupWSConnection = (socket) => {
    socket.on(socketEmissions.GET_DOCUMENT, async (documentId) => {
      await EditorProvider.initialise(socket, documentId)
      const data = await EditorProvider.loadDocument()

      socket.emit(socketEmissions.LOAD_DOCUMENT, data)

      if (data) {
        socket.join(documentId)

        socket.on(socketEmissions.SEND_DOCUMENT_CONTENT_CHANGES, (data) => {
          socket.broadcast
            .to(documentId)
            .emit(
              socketEmissions.RECEIVE_DOCUMENT_CONTENT_CHANGES,
              data.payload.delta,
            )
          EditorProvider.saveToCache(data.payload, () => {
            socket.emit(socketEmissions.LOAD_DOCUMENT, null)
            socket.disconnect()
          })
        })

        socket.on(socketEmissions.SEND_DOCUMENT_SELECTION, (data) => {
          const dataWithClientId = { ...data, clientId: socket.id }
          socket.broadcast
            .to(documentId)
            .emit(socketEmissions.RECEIVE_DOCUMENT_SELECTION, dataWithClientId)
        })

        socket.on('disconnect', () => {
          socket.broadcast
            .to(documentId)
            .emit(socketEmissions.CLIENT_DISCONNECTED, socket.id)
        })
      }
    })
  }

  const setUp = (io) => {
    io.on('connection', setupWSConnection)
  }

  return {
    setUp,
  }
})()

module.exports = SocketProvider
