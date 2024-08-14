const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')
// Define the Reading model
class Reading extends Model {}

Reading.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }, // Foreign key reference to the User model
  },
  blogId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'blogs', key: 'id' }, // Foreign key reference to the Blog model
  },
  status: {
    type: DataTypes.ENUM('unread', 'read'),
    defaultValue: 'unread',
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'reading',
})

module.exports = Reading
