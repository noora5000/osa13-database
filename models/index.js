const Blog = require('./psblog')
const User = require('./user')
const Reading = require('./reading')
const Session = require('./session')

// Define the one-to-many relationship between User and Blog
User.hasMany(Blog, { as: 'blogs' }) // A user can have many blogs
Blog.belongsTo(User, { as: 'user' }) // A blog belongs to a single user

// Define the many-to-many relationship between User and Blog through Reading
User.belongsToMany(Blog, { through: Reading, as: 'readings', onDelete: 'CASCADE' })
Blog.belongsToMany(User, { through: Reading, as: 'readings', onDelete: 'CASCADE' })

module.exports = {
  Blog,
  User,
  Reading,
  Session
}