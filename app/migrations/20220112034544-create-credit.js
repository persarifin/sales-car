'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Credits', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      optionMonth : {
        allowNull: false,
        type: Sequelize.TINYINT,
      },
      downPayment: {
        allowNull: false,
        type: Sequelize.DECIMAL(10,2),
      },
      interest:{
        allowNull: false,
        type:Sequelize.DECIMAL(10,2),
      },
      adminFee: {
        allowNull: false,
        type: Sequelize.DECIMAL(10,2),
      },
      creditPrice: {
        allowNull: false,
        type: Sequelize.DECIMAL(10,2),
      },
      carId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Credits');
  }
};