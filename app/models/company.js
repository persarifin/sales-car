'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Company.init({
    legalName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull: "This field legal name must be filled"
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull: "This field address must be filled"
      }
    },
    province: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull: "This field  province must be filled"
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull: "This field city must be filled"
      }
    },
    district: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull: "This field district must be filled"
      }
    },
  }, {
    sequelize,
    modelName: 'Company',
  });
  return Company;
};