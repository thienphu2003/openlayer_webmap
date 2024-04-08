"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return await queryInterface.createTable("city", {
      ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      Cityname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Cityimage: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      location: {
        type: Sequelize.JSON,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      deleted_at: { type: Sequelize.DATE },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return await queryInterface.dropTable("city");
  },
};
