const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')
const { DATABASE_SSL } = require('../util/config')

const { Umzug, SequelizeStorage } = require('umzug')
const session = require('express-session')
const SequelizeStore = require('connect-session-sequelize')(session.Store)

// Configure SSL options for the database connection if SSL is enabled
const sslOptions = DATABASE_SSL === 'true' ? {
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
} : {}

// Create a new Sequelize instance with the provided DATABASE_URL and SSL options
const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: sslOptions,
})

// Define the migration configuration for Umzug
const migrationConf = {
  migrations: {
    glob: 'migrations/*.js', // Migration files
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }), // Storage for migration history
  context: sequelize.getQueryInterface(), // Query interface for Sequelize
  logger: console, // Logger for migration actions
}

// A function to run all pending migrations with Umzug instance
const runMigrations = async () => {
  const migrator = new Umzug(migrationConf)
  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name), // List of executed migration files
  })
}

// A Function to roll back the last migration
const rollbackMigration = async () => {
  await sequelize.authenticate()
  const migrator = new Umzug(migrationConf)
  await migrator.down()
}

// A Function to connect to the database and run migrations
const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    await runMigrations()
    console.log('database connected')
  } catch (err) {
    console.log('connecting database failed')
    console.log(err)
    return process.exit(1)
  }
  return null
}

// Create a new SequelizeStore instance for session management
const sessionStore = new SequelizeStore({
  db: sequelize,
  tableName: 'sessions',
  checkExpirationInterval: 15 * 60 * 1000, // Check for expired sessions every 15 minutes
  expiration: 24 * 60 * 60 * 1000 // Session expiration time (24 hours)
})

sessionStore.sync()



module.exports = { connectToDatabase, sequelize, rollbackMigration, sessionStore }