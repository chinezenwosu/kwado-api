const config = {
  mongodb: {
    url: process.env.MONGO_CONNECTION_URI,
    name: process.env.MONGO_DB_NAME,
  },
  session: {
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    maxAge: 1000 * 60  * 60 * 24 * 30, // 30 days
  },
  env: {
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development',
    isLocal: process.env.NODE_ENV === 'local',
  },
  url: {
    port: process.env.PORT,
    domain: `${process.env.HOST}:${process.env.PORT}`,
    cors: process.env.CORS_ORIGIN.split(','),
  }
}

module.exports = config
