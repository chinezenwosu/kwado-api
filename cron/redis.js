const cron = require('node-cron')
const KwadocController = require('../controllers/Kwadoc.js')
const { getDocumentHash, DOCUMENT_PREFIX } = require('../utils/document.js')
const sanitize = require('sanitize-html')
const { QuillDeltaToHtmlConverter } = require('quill-delta-to-html')

const scheduleRedisCron = (redis) => {
  // every 5 minutes
  cron.schedule('* */5 * * * *', async () => {
    let allKeys = []

    try {
      allKeys = await redis.keys(getDocumentHash('*'))
    } catch (e) {
      console.log('Error getting keys', e)
    }

    for (let key of allKeys) {
      let document

      try {
        document = await redis.hGetAll(key)
      } catch (e) {
        console.log('Error getting all values from redis hash', e)
      }

      if (document) {
        const slug = key.split(DOCUMENT_PREFIX)[1]
        const content = JSON.parse(document.content)
        const htmlConverter = new QuillDeltaToHtmlConverter(content.ops, {})
        const html = htmlConverter.convert()

        try {
          const controller = new KwadocController()
          await controller.updateKwadocWhere(
            { slug },
            {
              content,
              html: sanitize(html),
            },
          )
        } catch (e) {
          console.log('Document update error', e)
        }

        const ONE_HOUR = 1000 * 60 * 60 // in milliseconds
        const KeepAliveTime = ONE_HOUR
        const currentTime = Date.now()

        if (currentTime - document.updatedAt > KeepAliveTime) {
          try {
            await redis.del(key)
          } catch (e) {
            console.log('Error discarding cache', e)
          }
        }
      }
    }
  })
}

exports.scheduleRedisCron = scheduleRedisCron
