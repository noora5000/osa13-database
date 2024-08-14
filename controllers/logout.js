const logoutRouter = require('express').Router()
const { userExtractor, requireLogin } = require('../util/middleware')

// Route to handle user logout
logoutRouter.delete('/', userExtractor, requireLogin, async (req, res, next) => {
  try {
    // Destroy the user's session
    req.session.destroy(() => {
      res.send('logged out suffessfully')
    })
  } catch (error) {
    next(error)
  }
})

module.exports = logoutRouter