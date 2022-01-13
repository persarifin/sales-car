'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CarImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  CarImage.init({
    image: {
      allowNull: false,
      type:  DataTypes.INTEGER,
      validate:{
        notNull: "This field image must be filled"
      }
    },
    carId: {
      allowNull: false,
      type:  DataTypes.INTEGER,
      validate:{
        notNull: "This field car id must be filled"
      }
    }
  }, {
    sequelize,
    modelName: 'CarImage',
  });
  return CarImage;
};