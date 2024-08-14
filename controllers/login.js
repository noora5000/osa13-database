const jwt = require('jsonwebtoken') // JWT library for creating tokens
const loginRouter = require('express').Router()
const { User } = require('../models')
const { SECRET } = require('../util/config')

// Route for user login
loginRouter.post('/', async (req, res, next) => {
  try {
    const { username, password } = req.body
    // check if the user is already logged in
    if (req.session.username === username) {
      const error = new Error('user already logged in')
      error.name = 'AlreadyLoggedIn'
      throw error
    }
    // Save username to the session (express-session)
    req.session.username = username
    // Find the user by username
    const user = await User.findOne({ where: { username: username } })
    if(user){
      const passwordCorrect = password === 'salainen'
      if (!(user && passwordCorrect)) {
        const error = new Error('wrong username or password')
        error.name = 'LoginCredentialsError'
        throw error
      }
      const userForToken = {
        username: user.username,
        id: user.id,
      }
      // Generate a JWT token
      const token = jwt.sign(userForToken, SECRET)
      res
        .status(200)
        .send({ token, username: user.username, name: user.name })
    } else {
      const error = new Error('user not found')
      error.name = 'UserNotFound'
      throw error
    }
  } catch (error) {
    next(error)
  }
})

module.exports = loginRouter