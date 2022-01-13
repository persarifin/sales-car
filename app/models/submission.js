'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Submission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Submission.belongsTo(models.Car, {foreignKey:'carId', as:'car'})
      Submission.belongsTo(models.Credit, {foreignKey:'creditId', as:'credit'})
      Submission.hasMany(models.Transaction, {foreignKey: 'submissionId', as:'transactions'})
    }
  };
  Submission.init({
    invoice:{
      allowNull: true,
      type: DataTypes.STRING
    },
    monthlyBill :{
      allowNull: true,
      type: DataTypes.DECIMAL(10,2)
    },
    amountOfBill: {
      allowNull: true,
      type: DataTypes.INTEGER
    },

    status:{
      allowNull:true,
      type: DataTypes.ENUM("PAID", "PARTIAL", "UNPAID"),
    },
    paid:{
      allowNull:true,
      type: DataTypes.DECIMAL
    },

    carId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      validate:{
        notNull:"Please select car"
      }
    },
    expiredPaymentAt:{
      allowNull:true,
      type: DataTypes.DATE
    },
    creditId:{
      allowNull: true,
      type: DataTypes.INTEGER
    },
  }, {
    sequelize,
    modelName: 'Submission',
  });
  return Submission;
};