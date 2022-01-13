'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transaction.belongsTo(models.Wallet, {foreignKey:'walletId', as:'wallet'})
      Transaction.belongsTo(models.Submission, {foreignKey:'submissionId', as:'submission'})
    }
  };
  Transaction.init({
    submissionId: {
      allowNull:false,
      type: DataTypes.INTEGER,
      validate:{
        notNull: 'please input submission id'
      }
    },
    amount: {
      allowNull: false,
      type: DataTypes.DECIMAL(10,2),
      validate:{
        notNull: 'please input amount'
      }
    },
    walletId:{
      allowNull:false,
      type: DataTypes.INTEGER,
      validate:{
        notNull: 'please input wallet id'
      }
    },
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};