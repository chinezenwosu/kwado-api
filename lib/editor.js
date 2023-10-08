const redis = require('../database/redis.js')
const KwadocController = require('../controllers/Kwadoc.js')
const { getDocumentHash } = require('../utils.js')

const EditorProvider = function() {
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

  return {
    loadDocument,
    saveToCache,
  }
}()

module.exports = EditorProvider
