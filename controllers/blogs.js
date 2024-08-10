const blogsRouter = require('express').Router()
// const Blog = require('../models/blog')
const Blog = require('../models/psblog')
// const User = require('../models/user')
// const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (req, res) => {
  try{
    const blogs = await Blog.findAll()
    console.log(JSON.stringify(blogs, null, 2))
    res.json(blogs)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

blogsRouter.post('/', async (req, res) => {
  try{
    const blog = await Blog.create(req.body)
    console.log(JSON.stringify(blog, null, 2))
    return res.json(blog)
  } catch (error){
    return res.status(400).json({ error })
  }
})
/*
blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes===null? 0 : body.likes,
    user: user._id
  })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response
    .status(201)
    .json(savedBlog)
})
*/

blogsRouter.delete('/:id', async (req, res) => {
  try{
    Blog.destroy({
      where: { id: req.params.id }
    })
    return res.status(204)
  } catch (error) {
    return res.status(400).json({ error })
  }
})
/*
blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  const user = request.user

  if(blog.user.toString() === user.id.toString()){
    // update user-object's blogs-field: remove the blog with requested id.
    user.blogs = user.blogs.filter(blogId => blogId.toString() !== blog.id)

    await User.findByIdAndUpdate(user.id.toString(), user, { new: true })
    await Blog.findByIdAndDelete(request.params.id)

  } else {
    response.status(401).json({ error: 'token invalid' })
  }
  response.status(204).end()

})
*/
/*
blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes===null? 0 : body.likes
  }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})
*/
module.exports = blogsRouter