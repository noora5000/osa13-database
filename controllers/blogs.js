const blogsRouter = require('express').Router()
const { Blog, User } = require('../models')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const { Op, literal } = require('sequelize')

// Middlewares
const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
      console.log('decoded token id', req.decodedToken)
    } catch (error){
      console.log(error)
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}
// Routes
blogsRouter.get('/', async (req, res) => {
  const where = {}

  if (req.query.search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${req.query.search}%` } },
      { author: { [Op.iLike]: `%${req.query.search}%` } },
      { url: { [Op.iLike]: `%${req.query.search}%` } }
    ]
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where,
    // Will order by max age descending
    order: literal('likes DESC')
  })
  console.log(JSON.stringify(blogs, null, 2))
  res.json(blogs)

})

blogsRouter.post('/', tokenExtractor, async (req, res) => {
  try{
    //const user = await User.findOne()
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({ ...req.body, userId: user.id })
    console.log(JSON.stringify(blog, null, 2))
    res.json(blog)
  } catch (error){
    console.log(req.body)
    return res.status(400).json({ error })
  }
})

blogsRouter.delete('/:id', blogFinder, tokenExtractor,  async (req, res) => {
  const creatorId = req.blog.userId
  const user = await User.findByPk(req.decodedToken.id)
  if(creatorId === user.id){
    req.blog.destroy()
    return res.status(204).json({ message: 'deleted' })
  } return res.status(401)
})

blogsRouter.get('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

blogsRouter.put('/:id', blogFinder, async (req, res) => {
  try{
    if (req.blog) {
      req.blog.likes = req.body.likes
      await req.blog.save()
      res.json(req.blog)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    return res.status(400).json({ error })
  }
})


module.exports = blogsRouter