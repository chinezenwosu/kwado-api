import cron from 'node-cron'
import { DOCUMENT_PREFIX, getDocumentHash } from '../utils.js'
import KwadocController from '../controllers/Kwadoc.js'

const scheduleRedisCron = (redis) => {
  cron.schedule("* */5 * * * *", async () => {
    let allKeys = []
  
    try {
      allKeys = await redis.keys(getDocumentHash('*'))
    }
    catch(e) {
      console.log('Error getting keys', e)
    }
  
    for (let key of allKeys) {
      let document
  
      try {
        document =  await redis.hGetAll(key);
      }
      catch(e) {
        console.log('Error get value from hash', e)
      }
  
      if (document) {
        const slug = key.split(DOCUMENT_PREFIX)[1]

        try {
          const controller = new KwadocController()
          await controller.updateKwadocWhere({ slug }, {
            content: JSON.parse(document.content)
          })
        }
        catch(e) {
          console.log('Document load error', e)
        }
  
        const KeepAliveTime =  10000 // in milliseconds
        const currentTime = Date.now()
        
        if (currentTime - document.updatedAt > KeepAliveTime) {
          try {
            await redis.del(key)
          }
          catch(e) {
            console.log('Error discarding cache', e)
          }
        }
      }
    }
  })
}

export { scheduleRedisCron }