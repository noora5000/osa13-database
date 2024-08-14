const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    // Add a 'disabled' column to the 'users' table
    await queryInterface.addColumn('users', 'disabled', {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    })
    // Create the 'sessions' table to store user sessions
    await queryInterface.createTable('sessions', {
      sid: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      sess: {
        type: DataTypes.JSONB,
        allowNull: false
      },
      expires: {
        type: DataTypes.DATE,
        allowNull: false
      }
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('users', 'disabled')
    await queryInterface.dropTable('sessions')
  },
}