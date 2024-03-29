// SPDX-License-Identifier: GPL-3.0-or-later
const sequelize = require('../lib/DatabaseProvider');
const DataTypes = require('sequelize').DataTypes;

const PointOfInterest = sequelize.define('PointOfInterest', {
	uuid: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true
	},
	serverUuid: {
		type: DataTypes.STRING,
		allowNull: false
	},
	type: {
		type: DataTypes.ENUM,
		values: ['Base', 'Point of Interest']
	},
	ownerName: {
		type: DataTypes.STRING(45),
		allowNull: true
	},
	allianceStatus: {
		type: DataTypes.ENUM,
		values: ['Owned', 'Allied', 'Friendly', 'Neutral', 'Hostile', 'Enemy'],
		defaultValue: 'Neutral'
	},
	wiped: {
		type: DataTypes.BOOLEAN,
		defaultValue: false
	},
	lat: {
		type: DataTypes.DOUBLE(3,1),
		allowNull: false
	},
	lng: {
		type: DataTypes.DOUBLE(3,1),
		allowNull: false
	},
	description: {
		type: DataTypes.STRING,
		allowNull: true
	}
});

module.exports = PointOfInterest;
