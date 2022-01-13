const bcrypt = require('bcryptjs')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      name: 'arifin',
      email: 'arifin@gmail.com',
      password : bcrypt.hashSync('password', 10),
      companyId: 0,
      address: 'sumenep jln a. no 02',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};