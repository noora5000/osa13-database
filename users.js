const mongoose = require('mongoose')
const users = [
  {
    _id: mongoose.Types.ObjectId('64a549e7f5c20e158b623a45'),
    username: 'root1',
    name: 'SuperUser',
    passwordHash: '$2b$10$NIl2uRf3DIFYhu3Xo30a7eFUaE9UA1w87xye9TJJegFO318uWWhUi',
    blogs: [
      mongoose.Types.ObjectId('5a422a851b54a676234d17f7'),
      mongoose.Types.ObjectId('5a422aa71b54a676234d17f8'),
      mongoose.Types.ObjectId('5a422b3a1b54a676234d17f9'),
      mongoose.Types.ObjectId('5a422b891b54a676234d17fa'),
      mongoose.Types.ObjectId('5a422ba71b54a676234d17fb'),
      mongoose.Types.ObjectId('5a422bc61b54a676234d17fc'),
    ],
    __v: 6
  }
]
module.exports = {
  users: users
}