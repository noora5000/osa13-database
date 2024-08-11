require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI
const DATABASE_URL = process.env.DATABASE_URL
const SECRET = process.env.SECRET

module.exports = {
  MONGODB_URI,
  DATABASE_URL,
  PORT,
  SECRET
}