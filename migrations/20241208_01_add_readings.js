const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    // Create the 'readings' table to track user-read status of blogs
    await queryInterface.createTable('readings', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },  // Reference to 'users' table
        onDelete: 'CASCADE', // Delete readings if the user is deleted
      },
      blog_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'blogs', key: 'id' }, // Reference to 'blogs' table
        onDelete: 'CASCADE', // Delete readings if the blog is deleted
      },
      status: {
        type: DataTypes.ENUM('unread', 'read'),
        defaultValue: 'unread',
      },
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('readings')
  },
}