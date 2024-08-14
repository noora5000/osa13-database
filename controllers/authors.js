const authorsRouter = require('express').Router()
const { Blog } = require('../models')
const { fn, col } = require('sequelize')

// Route to get a list of authors with the number of blogs and total likes
authorsRouter.get('/', async (req, res) => {
  try {
    // Fetch authors with aggregated data
    const authorList = await Blog.findAll({
      attributes: [
        'author', // author name
        [fn('COUNT', col('title')), 'blogs'], // Count of blogs per author
        [fn('SUM', col('likes')), 'likes'] // Total likes per author
      ],
      group: ['author'] // Group by author to aggregate data
    })

    res.json(authorList)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = authorsRouter
