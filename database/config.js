const config = {
  mongodb: {
    url: process.env.MONGO_CONNECTION_URI,
    name: process.env.MONGO_DB_NAME,
  },
  redis: {

  }
}

export { config }