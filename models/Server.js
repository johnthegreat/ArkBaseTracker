// SPDX-License-Identifier: GPL-3.0-or-later
const sequelize = require('../lib/DatabaseProvider');
const DataTypes = require('sequelize').DataTypes;

const Server = sequelize.define('Server', {
	uuid: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true
	},
	clusterUuid: {
		type: DataTypes.UUID,
		allowNull: false
	},
	serverName: {
		type: DataTypes.STRING,
		allowNull: false
	},
	mapType: {
		type: DataTypes.STRING,
		allowNull: false
	}
}, {
	indexes: [
		{
			unique: true,
			fields: ['clusterUuid', 'serverName']
		},
		{
			fields: ['mapType']
		}
	]
});

module.exports = Server;
