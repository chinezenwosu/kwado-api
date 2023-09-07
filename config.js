const config = {
  mongodb: {
    url: process.env.MONGO_CONNECTION_URI,
    name: process.env.MONGO_DB_NAME,
  },
  session: {
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    maxAge: 1000 * 60  * 60 * 24 * 30,
  },
  env: {
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development',
    isLocal: process.env.NODE_ENV === 'local',
  }
}

export { config }
