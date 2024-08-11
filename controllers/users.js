//const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
//const User = require('../models/user')
const { Blog, User } = require('../models')

usersRouter.get('/', async (req, res) => {
  const users = await User.findAll({
    include: { // Liitoskysely tehdään parametrinä olevaan olioon include-määreen avulla
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  })
  res.json(users)
})

usersRouter.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(error) {
    if(error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.errors.map(e => e.message) })
    }
    return res.status(400).json({ error })
  }
})

usersRouter.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

usersRouter.put('/:username', async (req, res) => {
  try{
    const user = await User.findOne({ where: { username: req.params.username } })
    if(user){
      user.name = req.body.name
      await user.save()
      res.json(user)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    return res.status(400).json({ error })
  }
})

/*
usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body
  if(password.length <= 3){
    response.status(400).json({ error:'password has to be at least 3 characters long' }).end()
  } else {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash,
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
  }


})

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', { url: 1, title: 1, author: 1, id: 1 })
  response.json(users)
})
*/
module.exports = usersRouter