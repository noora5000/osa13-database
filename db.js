require('dotenv').config()
const { Sequelize } = require('sequelize')

// Määritä logging: false
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: false
})

module.exports = sequelize
