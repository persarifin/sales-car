'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Credit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Credit.init({
    optionMonth:{
      allowNull: false,
      type: DataTypes.TINYINT,
      validate:{
        notNull: "This field  must be filled"
      }
    },
    downPayment:{
      allowNull: false,
      type: DataTypes.DECIMAL(10,2),
      validate:{
        notNull: "This field down payment (dp) must be filled"
      }
    },
    interest:{
      allowNull: false,
      type: DataTypes.DECIMAL(10,2),
      validate:{
        notNull: "This field interest must be filled"
      }
    },
    adminFee: {
      allowNull: false,
      type:  DataTypes.DECIMAL(10,2),
      validate:{
        notNull: "This field admin fee must be filled"
      }
    },
    creditPrice:{
      allowNull:true,
      type: DataTypes.DECIMAL(10,2)
    },
    carId: {
      allowNull: false,
      type:  DataTypes.INTEGER,
      validate:{
        notNull: "This field car id must be filled"
      }
    },
  }, {
    sequelize,
    modelName: 'Credit',
  });
  return Credit;
};