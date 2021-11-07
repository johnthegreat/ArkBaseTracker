const sequelize = require('../lib/DatabaseProvider');
const DataTypes = require('sequelize').DataTypes;

const Cluster = sequelize.define('Cluster',{
	uuid: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true
	},
	name: {
		type: DataTypes.STRING(100),
		allowNull: false
	},
	type: {
		type: DataTypes.ENUM,
		values: ['PVP', 'PVE'],
		allowNull: false
	}
},{
	indexes: [
		{
			unique: true,
			fields: ['name']
		}
	]
});

module.exports = Cluster;
