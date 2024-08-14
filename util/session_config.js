const session = require('express-session')
const { SECRET } = require('./config')
const { sessionStore } = require('./db')

// Session management configuration using express-session
const sessionConfig = session({
  secret: SECRET,
  store: sessionStore, // Store where the session data is persisted
  resave: false, // Do not save session if it was not modified
  saveUninitialized: false, // Do not create a session until something is stored in it
  cookie: {
    secure: false, // Set to true if using HTTPS
    maxAge: 24 * 60 * 60 * 1000 // Duration for the session cookie, 24 hours
  }
})

module.exports = sessionConfig
