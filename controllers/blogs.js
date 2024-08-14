const blogsRouter = require('express').Router()
const { Blog, User } = require('../models')
const { Op, literal } = require('sequelize')
const { userExtractor, requireLogin } = require('../util/middleware')

// Middleware to find a blog by its primary key
const blogFinder = async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    console.log('blog:', blog)
    if (!blog) {
      const error = new Error('blog not found')
      error.name = 'BlogNotFound'
      throw error
    }
    req.blog = blog
    next()
  } catch (error) {
    next(error) // Pass errors to the error handler middleware
  }
}

// Route to get all blogs with optional search functionality
blogsRouter.get('/', async (req, res) => {
  const where = {}
  // search functionality:
  if (req.query.search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${req.query.search}%` } },
      { author: { [Op.iLike]: `%${req.query.search}%` } },
      { url: { [Op.iLike]: `%${req.query.search}%` } }
    ]
  }
  // Fetch blogs with associated user data and order by likes
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['name']  // Include user's name
      }
    ],
    where, // add search functionality
    order: literal('likes DESC') // order by the number of likes, descending
  })
  res.json(blogs)
})

// Route to create a new blog post
blogsRouter.post('/', userExtractor, requireLogin, async (req, res, next) => {
  try{
    const blog = await Blog.create({ ...req.body, userId: req.user.id })
    res.json(blog)
  } catch (error){
    next(error)
  }
})

// Route to delete a blog post
blogsRouter.delete('/:id', blogFinder, userExtractor, requireLogin,  async (req, res, next) => {
  try{
    const creatorId = req.blog.userId
    if(creatorId === req.user.id){
      req.blog.destroy()
      return res.status(204).json({ message: 'deleted' })
    } else {
      const error = new Error('not permitted')
      error.name = 'WrongUser'
      throw error
    }
  } catch (error){
    next(error)
  }
})

// Route to get a blog post by id
blogsRouter.get('/:id', blogFinder, async (req, res) => {
  res.json(req.blog)
})

// Route to update the number of likes for a blog post
blogsRouter.put('/:id', blogFinder, async (req, res) => {
  req.blog.likes = req.body.likes
  await req.blog.save()
  res.json(req.blog)
})


module.exports = blogsRouter