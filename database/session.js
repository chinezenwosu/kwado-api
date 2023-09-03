import session from 'express-session'
import RedisStore from 'connect-redis'
import { config } from '../config.js'

const getSessionStore = (redis) => {
  return session({
    store: new RedisStore({ client: redis }),
    name: config.session.name, 
    secret: config.session.secret, 
    resave: false, 
    saveUninitialized: true, 
    cookie: {
      // Only set to true if you are using HTTPS.
      // Secure Set-Cookie attribute.
      secure: config.env.isProduction,
      // Only set to true if you are using HTTPS.
      httpOnly: config.env.isProduction,
      // Session max age in milliseconds. (1 min)
      // Calculates the Expires Set-Cookie attribute
      maxAge: config.session.maxAge,
    }
  })
}

export { getSessionStore }