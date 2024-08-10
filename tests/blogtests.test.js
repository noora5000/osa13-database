const listHelper = require('../utils/list_helper')
const blogs = require('../blogs.js')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]
  test('when only one blog in the list -> the result equals the likes of that', () => {
    const likes = listHelper.totalLikes(listWithOneBlog)
    expect(likes).toBe(5)
  })
})

describe('blog with most likes', () => {
  test('is able to find the blog with most likes', () => {
    const mostLikedBlog = listHelper.favoriteBlog(blogs.blogs)
    expect(mostLikedBlog.likes).toEqual(12)
  })
})

describe('author with most blogs', () => {
  test('is able to find the author with most blogs', () => {
    const mostBlogsAuthor = listHelper.mostBlogs(blogs.blogs)
    expect(mostBlogsAuthor.author).toEqual('Robert C. Martin') && (mostBlogsAuthor.blogs).toEqual(3)
  })
})

describe('author with most likes', () => {
  test('is able to find the author with most likes', () => {
    const mostLikesAuthor = listHelper.mostLikes(blogs.blogs)
    expect(mostLikesAuthor.author).toEqual('Edsger W. Dijkstra') && (mostLikesAuthor.likes).toEqual(17)
  })
})