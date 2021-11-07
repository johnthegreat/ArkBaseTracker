const Sequelize = require('sequelize').Sequelize;
const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: process.env.SQLITE_DB_PATH
});
module.exports = sequelize;
