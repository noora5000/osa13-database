const usersRouter = require('express').Router()
const { Blog, User } = require('../models')

// Route to get all users with their blogs
usersRouter.get('/', async (req, res) => {
  const users = await User.findAll({
    include: [
      { // Include associated blogs for each user
        model: Blog,
        as: 'blogs',
        attributes: { exclude: ['userId'] }
      }
    ]
  })
  res.json(users)
})

// Route to create a new user
usersRouter.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(error) {
    next(error)
  }
})

// Route to get a user by id
usersRouter.get('/:id', async (req, res, next) => {
  try{
    const where = {}
    // Apply filter (read = true?) if provided
    const readFilter = req.query.read
    if(readFilter){
      where.status = readFilter === 'true' ? 'read' : 'unread'
    }
    const user = await User.findByPk(req.params.id, {
      include: [
        { // Include user's reading list (aka blogs as reading list items)
          model: Blog,
          as: 'readings',
          attributes: { exclude: ['userId', 'reading'] },
          through: { attributes: ['status', 'id'], where: where }
        }
      ]
    })
    if (!user) {
      const error = new Error('no such user')
      error.name = 'UserNotFound'
      throw error
    }
    res.json(user)
  } catch (error){
    next(error)
  }
})

// Route to update a user's name by username
usersRouter.put('/:username', async (req, res, next) => {
  try{
    const user = await User.findOne({ where: { username: req.params.username } })
    if(user){
      user.name = req.body.name
      await user.save()
      res.json(user)
    } else {
      const error = new Error('no such user')
      error.name = 'UserNotFound'
      throw error
    }
  } catch (error) {
    next(error)
  }
})
module.exports = usersRouter