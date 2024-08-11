const Blog = require('./psblog')
const User = require('./user')

// Viiteavaimen määrittely käyttäjän ja blogilisäyksen liittämiseksi.
User.hasMany(Blog)
Blog.belongsTo(User)

Blog.sync({ alter: true })
User.sync({ alter:true })

module.exports = {
  Blog,
  User
}