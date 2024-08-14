const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')
class Session extends Model {}
// Define the Session model
Session.init({
  sid: { // session id
    type: DataTypes.STRING,
    primaryKey: true,
  },
  sess: { // session data
    type: DataTypes.JSONB,
    allowNull: false
  },
  expires: { // session expiration
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'sessions',
  underscored: true,
  timestamps: false,
  modelName: 'session'
})

module.exports = Session