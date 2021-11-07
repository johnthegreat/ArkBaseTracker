const sequelize = require('../lib/DatabaseProvider');
const DataTypes = require('sequelize').DataTypes;

const Cluster = require('../models/Cluster');

const Server = sequelize.define('Server', {
	uuid: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true
	},
	clusterUuid: {
		type: DataTypes.UUID,
		allowNull: false,
		references: {
			model: Cluster,
			key: 'uuid'
		}
	},
	mapType: {
		type: DataTypes.STRING,
		allowNull: false
	},
	mapNumber: {
		type: DataTypes.INTEGER
	}
}, {
	indexes: [
		{
			unique: true,
			fields: ['clusterUuid', 'mapType', 'mapNumber']
		},
		{
			fields: ['mapType']
		}
	]
});

module.exports = Server;
