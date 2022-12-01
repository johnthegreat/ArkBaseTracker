// SPDX-License-Identifier: GPL-3.0-or-later
const sequelize = require('../lib/DatabaseProvider');
const DataTypes = require('sequelize').DataTypes;

const PointOfInterest = require('../models/PointOfInterest');

const PointOfInterestAttachment = sequelize.define('PointOfInterestAttachment', {
	uuid: {
		type: DataTypes.STRING,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true
	},
	pointOfInterestUuid: {
		type: DataTypes.UUID,
		allowNull: false,
		references: {
			model: PointOfInterest,
			key: 'uuid'
		}
	},
	originalFileName: {
		type: DataTypes.STRING,
		allowNull: false
	},
	bucketName: {
		type: DataTypes.STRING,
		allowNull: false
	},
	objectName: {
		type: DataTypes.STRING,
		allowNull: false
	}
}, {
	indexes: [
		{
			unique: true,
			fields: ['bucketName', 'objectName']
		}
	]
});

module.exports = PointOfInterestAttachment;
