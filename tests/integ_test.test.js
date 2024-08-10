const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const testHelper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
let token = null

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(testHelper.initialBlogs)
  await User.deleteMany({})
  await User.insertMany(testHelper.initialUsers)

  const response = await api.get('/api/users')

  const loginData = {
    username: response.body[0].username,
    password: 'salainen'
  }

  const loginResponse = await api
    .post('/api/login')
    .send(loginData)
  token = loginResponse.body.token
})

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    const response = await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveLength(testHelper.initialBlogs.length)
  })

  test('key is id, not _id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body.id).toBeDefined
  })

  describe('addition of a new blog', () => {
    const newBlog = {
      title: 'Test title',
      author: 'Test-y Tester',
      url: 'http://www.test.com/',
      likes: null
    }
    test('blog addition succeeds', async () => {
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await testHelper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(testHelper.initialBlogs.length + 1)

      const title = blogsAtEnd.map(n => n.title)
      expect(title).toContain(
        'Test title'
      )
    })
    test('blog addition without token returns status code 401', async () => {
      await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)
    })
    // eslint-disable-next-line quotes
    test("'likes' value null is auto-filled to value 0", async () => {
      const newBlog = {
        title: 'Test title',
        author: 'Test-y Tester',
        url: 'http://www.test.com/',
        likes: null
      }
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await testHelper.blogsInDb()
      const lastBlog = blogsAtEnd[blogsAtEnd.length-1]
      expect(lastBlog.title).toEqual(newBlog.title)
      expect(lastBlog.likes).toEqual(0)
    })
    test('Status code 400 (bad request) if entry is being sent without title or url', async () => {
      const newBlog1 = {
        title: null,
        author: 'author',
        url: 'url',
        likes: 0
      }
      const newBlog2 = {
        title: 'title',
        author: 'author',
        url: null,
        likes: 0
      }

      const post1 = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog1)
      const post2 = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog2)

      expect(post1.status && post2.status).toBe(400)
    })
  })

  describe('file removal', () => {
    test('successful file removal returns status code 204', async () => {
      const blogsAtStart = await testHelper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await testHelper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(
        testHelper.initialBlogs.length - 1
      )

      const titles = blogsAtEnd.map(r => r.title)

      expect(titles).not.toContain(blogToDelete.title)
    })
    test('file removal without token returns status code 401', async () => {
      const blogToDelete = testHelper.initialBlogs[1]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', 'Bearer')
        .expect(401)
    })

  })
  describe('update', () => {
    test('successful file update returns status code 200 and changes get updated', async () => {
      const blogsAtStart = await testHelper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const updatedBlog = {
        title: blogToUpdate.title,
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: blogToUpdate.likes+1
      }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)

      const blogsAtEnd = await testHelper.blogsInDb()
      expect(blogsAtStart[0].likes).not.toEqual(blogsAtEnd[0].likes)
    })
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})