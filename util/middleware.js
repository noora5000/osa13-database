const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const { User } = require('../models')

// Error handling middleware
// eslint-disable-next-line no-unused-vars
const errorHandler = (error, _req, response, _next) => {
  if (error.name === 'SequelizeValidationError') {
    return response.status(400).json({ error: error.errors[0].message })
  }
  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid or missing token' })
  }
  if (error.name === 'MissingLogin') {
    return response.status(401).json({ error: 'log in to perform this function' })
  }
  if(error.name === 'AlreadyLoggedIn') {
    return response.status(401).json({ error: 'user already logged in' })
  }
  if (error.name === 'UserNotFound') {
    return response.status(404).json({ error: 'user not found' })
  }
  if (error.name === 'DisabledUser') {
    return response.status(401).json({ error: 'user is disabled' })
  }
  if (error.name === 'WrongUser') {
    return response.status(401).json({ error: 'user is allowed to make changes only to their own instance' })
  }
  if(error.name === 'SequelizeForeignKeyConstraintError') {
    return response.status(404).json({ error: 'item not found' })
  }
  if(error.name === 'BlogNotFound') {
    return response.status(404).json({ error: 'blog not found' })
  }
  if(error.name === 'SequelizeUniqueConstraintError') {
    return response.status(400).json({ error: 'username has to be unique' })
  }
  if(error.name === 'LoginCredentialsError') {
    return response.status(400).json({ error: 'wrong username or password' })
  }
  console.error(error.message)
  return response.status(500).json({ error: error.message }).end()
}

// Middleware to ensure the user is logged in before accessing a route
const requireLogin = (req, res, next) => {
  try{
    if (!req.session.username) {
      //return res.status(401).send('log in to access this route')
      const error = new Error('login needed')
      error.name = 'MissingLogin'
      throw error
    }
    next()
  } catch (error) {
    next(error)
  }
}

// Middleware to extract and verify the user from a JWT token
const userExtractor = async (req, res, next) => {
  try{
    const authorization = req.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
      req.token = authorization.replace('Bearer ', '')
      // Verify the token using the secret key
      const decodedToken = jwt.verify(req.token, SECRET)
      if(!decodedToken.id){
        const error = new Error('token invalid')
        error.name = 'JsonWebTokenError'
        throw error
      }
      const user = await User.findByPk(decodedToken.id)
      if(user && user.disabled === true){
        const error = new Error('user disabled')
        error.name = 'DisabledUser'
        throw error
      } else {
        req.user = user
      }
    } else {
      const error = new Error('token missing')
      error.name = 'JsonWebTokenError'
      throw error
    }
    next()
  } catch (error){
    next(error)
  }
}


module.exports = {
  errorHandler,
  userExtractor,
  requireLogin,

}