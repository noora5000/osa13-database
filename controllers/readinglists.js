const readingListRouter = require('express').Router()
const { Reading } = require('../models')
const { userExtractor, requireLogin } = require('../util/middleware')

// Route to add a blog to the user's reading list
readingListRouter.post('/', userExtractor, requireLogin, async (req, res, next) => {
  try{
    const { user_id, blog_id } = req.body
    // Check if the user making the request is the same as the user_id
    if(req.user.id === user_id) {
      const reading = await Reading.create({ userId: user_id, blogId: blog_id })
      res.status(201).json(reading)
    } else {
      const error = new Error('wrong user')
      error.name = 'WrongUser'
      throw error
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

// Route to update the status of a reading list item
readingListRouter.put('/:id', userExtractor, requireLogin, async (req, res, next) => {
  try{
    const readingListInstance = await Reading.findByPk(req.params.id)
    if(!readingListInstance){
      const error = new Error('item not found')
      error.name = 'SequelizeForeignKeyConstraintError'
      throw error
    }
    // Check if the user making the request is the owner of the reading list item
    if(req.user.id === readingListInstance.userId){
      const { read } = req.body
      readingListInstance.status = read ? 'read' : 'unread'
      await readingListInstance.save()
      res.status(200).json(readingListInstance).end()
    } else {
      const error = new Error('wrong user')
      error.name = 'WrongUser'
      throw error
    }
  } catch (error) {
    next(error)
  }
})

module.exports = readingListRouter

