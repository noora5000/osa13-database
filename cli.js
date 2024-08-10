const Blog = require('./models/psblog')
const sequelize = require('./db')

async function fetchBlogs () {
  const blogs = await Blog.findAll()
  blogs.forEach(blog => {console.log(`${blog.dataValues.author}: '${blog.dataValues.title}', ${blog.dataValues.likes} likes`)})
  await sequelize.close()
}
fetchBlogs()