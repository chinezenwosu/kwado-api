import { redis } from '../database/redis.js'
import { getDocumentHash } from '../utils.js'
import KwadocController from '../controllers/Kwadoc.js'

const onDocumentLoad = async pathname => {
  // fetch from redis first
  const key = pathname.slice('1')

  try {
    let document =  await redis.hGet(getDocumentHash(key), 'content');
    if (document) {
      return JSON.parse(document)
    }

    const controller = new KwadocController()
    document = await controller.getKwadocByID(key)
    return document.content
  }
  catch(e) {
    console.log('Document load error', e)
  }

  return null
}

const onDocumentSave = async (pathname, doc) => {
  // save document
  const key = pathname.slice('1')
  await redis.hSet(getDocumentHash(key), 'content', JSON.stringify(doc));
  await redis.hSet(getDocumentHash(key), 'updatedAt', Date.now());
}

const onAuthRequest = async (query, socket) => {
  // some query validation
  return true
}

export { onDocumentLoad, onDocumentSave, onAuthRequest }