const express = require('express');
const router = express.Router();

const doesClusterExist = require('../middleware/doesClusterExist');
const doesServerBelongToCluster = require('../middleware/doesServerBelongToCluster');
const doesPointOfInterestBelongToServer = require('../middleware/doesPointOfInterestBelongToServer');

const PointOfInterest = require('../../models/PointOfInterest');

router.get('/api/cluster/:uuid/server/:serverUuid/point-of-interest', doesClusterExist, doesServerBelongToCluster, async function(req, res, next) {
	const serverUuid = req.params['serverUuid'];

	const pointOfInterests = await PointOfInterest.findAll({
		where: {
			serverUuid: serverUuid
		}
	});
	res.json(pointOfInterests);
});

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

router.post('/api/cluster/:uuid/server/:serverUuid/point-of-interest', doesClusterExist, doesServerBelongToCluster, async function (req, res) {
	const pointOfInterest = PointOfInterest.build(req.body);
	pointOfInterest.serverUuid = req.params['serverUuid'];
	await pointOfInterest.save();
	res.status(201).json(pointOfInterest);
});

router.put('/api/cluster/:uuid/server/:serverUuid/point-of-interest/:pointOfInterestUuid', doesClusterExist, doesServerBelongToCluster, doesPointOfInterestBelongToServer, async function(req, res) {
	const pointOfInterest = PointOfInterest.build(req.body);
	pointOfInterest.serverUuid = req.params['serverUuid'];
	await pointOfInterest.save();
	res.json(pointOfInterest);
});

router.delete('/api/cluster/:uuid/server/:serverUuid/point-of-interest/:pointOfInterestUuid', doesClusterExist, doesServerBelongToCluster, doesPointOfInterestBelongToServer, async function(req, res) {
	const pointOfInterest = await PointOfInterest.findByPk(req.params['pointOfInterestUuid']);
	await pointOfInterest.destroy();
	res.status(204).send();
});

module.exports = router;
