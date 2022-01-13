'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Submissions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      invoice:{
        allowNull: false,
        type: Sequelize.STRING
      },
      monthlyBill :{
        allowNull: false,
        type: Sequelize.DECIMAL(10,2),
        default: 0
      },
      paid :{
        allowNull: false,
        type: Sequelize.DECIMAL(10,2),
        default: 0
      },
      amountOfBill: {
        allowNull: false,
        type: Sequelize.DECIMAL(10,2),
        default: 0
      },
      expiredPaymentAt:{
        allowNull:true,
        type: Sequelize.DATE
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM(['UNPAID','PAID','PARTIAL'])
      },
      carId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      creditId:{
        allowNull: true,
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
    await queryInterface.dropTable('Submissions');
  }
};