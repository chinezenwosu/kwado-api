const redis = require('../database/redis.js')
const KwadocController = require('../controllers/Kwadoc.js')
const { getDocumentHash } = require('../utils/document.js')
const { debounce } = require('../utils/debounce.js')

const EditorProvider = (function () {
  let _socket = null
  let _documentId = null
  let _kwadoc = null
  const _kwadocController = new KwadocController()

  const initialise = async (socket, documentId) => {
    _socket = socket
    _documentId = documentId
  }

  const _authorise = async () => {
    try {
      const currentUserId = _socket.request.session.user
      _kwadoc = await _kwadocController.getKwadocBy('slug', _documentId)
      const isAuthorised = _kwadoc.users.find(
        (user) => user.user._id.toString() === currentUserId,
      )
      return !!isAuthorised
    } catch (e) {
      console.log('Unable to authorise kwadoc', e)
      return false
    }
  }

  const loadDocument = async () => {
    const isAuthorised = await _authorise()

    if (!isAuthorised) {
      return null
    }
    // fetch from redis first
    try {
      const document = await redis.hGet(getDocumentHash(_documentId), 'content')

      if (document) {
        return JSON.parse(document)
      }

      return _kwadoc?.content
    } catch (e) {
      console.log('Document load error', e)
    }

    return null
  }

  const saveToCache = async (payload, errorCallback) => {
    const { data } = payload
    await redis.hSet(
      getDocumentHash(_documentId),
      'content',
      JSON.stringify(data),
    )
    await redis.hSet(getDocumentHash(_documentId), 'updatedAt', Date.now())

    debounce.submit(
      async () => {
        const isAuthorised = await _authorise()

        if (!isAuthorised) {
          errorCallback()
        }
      },
      1000 * 60 * 5,
    )
  }

  return {
    initialise,
    loadDocument,
    saveToCache,
  }
})()

module.exports = EditorProvider
