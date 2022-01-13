'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Car extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // // define association here
      Car.hasMany(models.Credit, {foreignKey: 'carId', as:'credits'})
      Car.hasMany(models.CarImage, {foreignKey: 'carId', as:'car_images'})
      Car.belongsTo(models.User, {foreignKey: 'userId', as:'user'})
    }
  };
  Car.init({
    carType: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: {msg: 'Please enter car type'},
      }
    },
    warranty:{
      allowNull: false,
      type: DataTypes.TINYINT,
      validate: {
        notNull: {msg: 'Please enter warranty'},
      }
    },
    specification:{
      allowNull: false,
      type: DataTypes.JSON,
      validate: {
        notNull: {msg: 'Please enter secification'},
      }
    },
    description: {
      allowNull: false,
      type: DataTypes.TEXT,
      validate: {
        notNull: {msg: 'Please enter description'},
      }
    },
    producer: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: {msg: 'Please enter producer'},
      }
    },
    price: {
      allowNull: false,
      type: DataTypes.DECIMAL(10,2),
      validate: {
        notNull: {msg: 'Please enter price'},
      }
    },
    userId:{
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Car',
  });
  return Car;
};