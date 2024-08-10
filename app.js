// const config = require('./utils/config')
require('dotenv').config()
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
// const logger = require('./utils/logger')
// const mongoose = require('mongoose')
// mongoose.set('strictQuery', false)
//
// logger.info('connecting to', config.MONGODB_URI)
//
// mongoose.connect(config.MONGODB_URI)
//   .then(() => {
//     logger.info('connected to MongoDB')
//   })
//   .catch((error) => {
//     logger.error('error connecting to MongoDB:', error.message)
//   })

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

app.use(middleware.requestLogger)

app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

//  lisätään testing-router backendiin ainoastaan jos sovellusta suoritetaan test-moodissa:
//  HTTP POST ‑operaatio backendin endpointiin /api/testing/reset tyhjentää tietokannan.
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app