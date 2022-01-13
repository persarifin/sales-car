'use strict';
const bcrypt = require('bcryptjs')

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.AccessToken, {foreignKey: 'userId', as:'tokens'})
      User.belongsTo(models.Company, {foreignKey: 'companyId', as:'company'})
    }
  };
  User.init({
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notNull: {msg: 'Please enter your name'},
      }
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: {
        args: true,
        msg: 'Email address already in use!'
      },
      validate: {
        notNull: {msg : 'Please enter your email'},
        isEmail: {msg: 'Email not valid !'},
      }
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {msg : 'Please enter address'},
      }
    },
    companyId:{
      allowNull:true,
      type: DataTypes.INTEGER,
      defaultValue:0
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notNull: {msg: 'Please enter your password'}
      }
    },
  }, {
    sequelize,
    hooks: {
      beforeCreate: (user, options) => {
        user.password = bcrypt.hashSync(user.password, 10)
      },
    },
    modelName: 'User',
  });
  return User;
};