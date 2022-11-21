const express = require('express');
const router = express.Router();

const doesClusterExist = require('../middleware/doesClusterExist');
const doesServerBelongToCluster = require('../middleware/doesServerBelongToCluster');
const doesPointOfInterestBelongToServer = require('../middleware/doesPointOfInterestBelongToServer');

const PointOfInterest = require('../../models/PointOfInterest');

const allowedIncomingPointOfInterestFieldNames = ['type', 'ownerName', 'allianceStatus', 'wiped', 'lat', 'lng', 'description'];

/*
 * GET /api/cluster/:uuid/server/:serverUuid/point-of-interest
 * Params:
 * - uuid (string)
 * - serverUuid (string)
 * Status Codes:
 * - 200
 * - 404
 */
router.get('/api/cluster/:uuid/server/:serverUuid/point-of-interest', doesClusterExist, doesServerBelongToCluster, async function(req, res, next) {
	const serverUuid = req.params['serverUuid'];

	const pointOfInterests = await PointOfInterest.findAll({
		where: {
			serverUuid: serverUuid
		}
	});
	res.json(pointOfInterests);
});

/*
 * GET /api/cluster/:uuid/server/:serverUuid/point-of-interest/:pointOfInterestUuid
 * Params:
 * - uuid (string)
 * - serverUuid (string)
 * - pointOfInterestUuid (string)
 * Status Codes:
 * - 200
 * - 404
 */
router.get('/api/cluster/:uuid/server/:serverUuid/point-of-interest/:pointOfInterestUuid', doesClusterExist, doesServerBelongToCluster, doesPointOfInterestBelongToServer, async function(req, res) {
	const pointOfInterestUuid = req.params['pointOfInterestUuid'];

	const pointOfInterest = await PointOfInterest.findOne({
		where: {
			uuid: pointOfInterestUuid
		}
	});
	if (!pointOfInterest) {
		return res.status(404).send();
	}
	res.json(pointOfInterest);
});

/*
 * POST /api/cluster/:uuid/server/:serverUuid/point-of-interest
 * Params:
 * - uuid (string)
 * - serverUuid (string)
 * Body:
 * - type (string)
 * - ownerName (string)
 * - allianceStatus (string)
 * - wiped (boolean)
 * - lat (number)
 * - lng (number)
 * - description (string)
 * Status Codes:
 * - 201
 * - 404
 */
router.post('/api/cluster/:uuid/server/:serverUuid/point-of-interest', doesClusterExist, doesServerBelongToCluster, async function (req, res) {
	const pointOfInterest = PointOfInterest.build(_.pick(req.body, allowedIncomingPointOfInterestFieldNames));
	pointOfInterest.serverUuid = req.params['serverUuid'];
	await pointOfInterest.save();
	res.status(201).json(pointOfInterest);
});

/*
 * PUT /api/cluster/:uuid/server/:serverUuid/point-of-interest/:pointOfInterestUuid
 * Params:
 * - uuid (string)
 * - serverUuid (string)
 * - pointOfInterestUuid (string)
 * Body:
 * - type: string
 * - ownerName: string
 * - allianceStatus: string
 * - lat: number
 * - lng: number
 * - wiped: boolean
 * - description: string
 * Status Codes:
 * - 200
 * - 404
 */
router.put('/api/cluster/:uuid/server/:serverUuid/point-of-interest/:pointOfInterestUuid', doesClusterExist, doesServerBelongToCluster, doesPointOfInterestBelongToServer, async function(req, res) {
	const pointOfInterest = await PointOfInterest.findByPk(req.params['pointOfInterestUuid']);
	if (!pointOfInterest) {
		return res.status(404).send();
	}

	if (req.body.type !== null) {
		pointOfInterest.type = req.body.type;
	}
	if (req.body.ownerName !== null) {
		pointOfInterest.ownerName = req.body.ownerName;
	}
	if (req.body.allianceStatus !== null) {
		pointOfInterest.allianceStatus = req.body.allianceStatus;
	}
	if (req.body.lat !== null) {
		pointOfInterest.lat = req.body.lat;
	}
	if (req.body.lng !== null) {
		pointOfInterest.lng = req.body.lng;
	}
	if (req.body.wiped !== null) {
		pointOfInterest.wiped = req.body.wiped;
	}
	if (req.body.description !== null) {
		pointOfInterest.description = req.body.description;
	}
	await pointOfInterest.save();
	res.json(pointOfInterest);
});

/*
 * DELETE /api/cluster/:uuid/server/:serverUuid/point-of-interest/:pointOfInterestUuid
 * Params:
 * - uuid (string)
 * - serverUuid (string)
 * - pointOfInterestUuid (string)
 * Status Codes:
 * - 204
 * - 404
 */
router.delete('/api/cluster/:uuid/server/:serverUuid/point-of-interest/:pointOfInterestUuid', doesClusterExist, doesServerBelongToCluster, doesPointOfInterestBelongToServer, async function(req, res) {
	const pointOfInterest = await PointOfInterest.findByPk(req.params['pointOfInterestUuid']);
	await pointOfInterest.destroy();
	res.status(204).send();
});

module.exports = router;
