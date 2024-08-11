const dummy = (blogs) => {
  if(blogs){
    return 1
  }
}

const totalLikes = (array) => {
  const sumOfLikes = array.reduce((total, obj) => total + obj.likes, 0)
  return sumOfLikes
}

const favoriteBlog = (array) => {
  const mostLiked = array.reduce((leader, current) => {
    if (!leader || current.likes > leader.likes) {
      return current
    }
    return leader
  }, null)
  const refined = {
    'title': mostLiked.title,
    'author': mostLiked.author,
    'likes': mostLiked.likes
  }
  return refined
}

const authorsCount = (array, likes) => {
  const authorCount = array.reduce((counts, blog) => {
    const author = blog.author
    const plus = likes ? blog.likes : 1
    counts[author] = (counts[author] || 0) + plus
    return counts
  }, {})
  return authorCount
}

const findHighestCountAuthor = (counts, keyname) => {
  let highestCountAuthor = null
  let highestCount = 0

  for (const author in counts) {
    if (counts[author] > highestCount) {
      highestCountAuthor = {
        author: author,
      }
      highestCountAuthor[keyname] = counts[author],
      highestCount = counts[author]
    }
  }

  return highestCountAuthor
}

const mostBlogs = (array) => {
  const counts = authorsCount(array, false)
  const mostBlogsAuthor = findHighestCountAuthor(counts, 'blogs')
  return mostBlogsAuthor
}

const mostLikes = (array) => {
  const counts = authorsCount(array, true)
  const mostLikesAuthor = findHighestCountAuthor(counts, 'likes')
  return mostLikesAuthor
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}