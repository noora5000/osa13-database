const authorsRouter = require('express').Router()
const { Blog } = require('../models')
const { fn, col } = require('sequelize')


authorsRouter.get('/', async (req, res) => {
  const authorList = await Blog.findAll({
    attributes: [
      'author',
      [fn('COUNT', col('title')), 'blogs'],
      [fn('SUM', col('likes')), 'likes']
    ],
    group: ['author']
  })

  res.json(authorList)
})

module.exports = authorsRouter