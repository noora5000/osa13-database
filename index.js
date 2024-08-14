const express = require('express')
const sessionConfig = require('./util/session_config')
const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const logoutRouter = require('./controllers/logout')
const authorRouter = require('./controllers/authors')
const readingListRouter = require('./controllers/readinglists')
const { errorHandler } = require('./util/middleware')

const app = express()

// Middleware to parse JSON request bodies
app.use(express.json())
// Middleware to handle sessions
app.use(sessionConfig)

// Define routes for app resources
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/logout', logoutRouter)
app.use('/api/authors', authorRouter)
app.use('/api/readinglists', readingListRouter)

// Middleware to handle unknown endpoints
app.use((req, res) => {
  res.status(404).json({ error: 'unknown endpoint' })
})
// Middleware for error handling
app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()