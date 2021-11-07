const express = require('express');
const router = express.Router();
const _ = require('lodash');

const doesClusterExist = require('../middleware/doesClusterExist');
const doesServerBelongToCluster = require('../middleware/doesServerBelongToCluster');
const doesPointOfInterestBelongToServer = require('../middleware/doesPointOfInterestBelongToServer');

const PointOfInterestAttachment = require('../../models/PointOfInterestAttachment');

const createMulterInstance = require('../../utils/createMulterInstance');
const upload = createMulterInstance(['image/png', 'image/jpg', 'image/jpeg']);

const TinifyImageService = require('../../lib/TinifyImageService');
const tinifyImageService = new TinifyImageService();

router.get('/api/cluster/:uuid/server/:serverUuid/point-of-interest/:pointOfInterestUuid/attachment',
	doesClusterExist, doesServerBelongToCluster, doesPointOfInterestBelongToServer, async function(req, res, next) {
	const pointOfInterestUuid = req.params['pointOfInterestUuid'];

	const pointOfInterestAttachments = await PointOfInterestAttachment.findAll({
		where: {
			pointOfInterestUuid: pointOfInterestUuid
		}
	});
	res.json(pointOfInterestAttachments);
});

router.get('/api/cluster/:uuid/server/:serverUuid/point-of-interest/:pointOfInterestUuid/attachment/:pointOfInterestAttachmentUuid',
	doesClusterExist, doesServerBelongToCluster, doesPointOfInterestBelongToServer, async function(req, res) {
	const pointOfInterestAttachmentUuid = req.params['pointOfInterestAttachmentUuid'];

	const pointOfInterestAttachment = await PointOfInterestAttachment.findByPk(pointOfInterestAttachmentUuid);
	if (!pointOfInterestAttachment) {
		return res.status(404).send();
	}
	res.json(pointOfInterestAttachment);
});

router.post('/api/cluster/:uuid/server/:serverUuid/point-of-interest/:pointOfInterestUuid/attachment',
	doesClusterExist, doesServerBelongToCluster, doesPointOfInterestBelongToServer, upload.single('file'), async function (req, res) {
	if (!req.file) {
		res.status(400).send();
		return;
	}

	const pointOfInterestAttachment = PointOfInterestAttachment.build({
		pointOfInterestUuid: req.params['pointOfInterestUuid'],
		originalFileName: req.file.originalname,
		bucketName: req.file.bucketName,
		objectName: req.file.objectName
	});
	await pointOfInterestAttachment.save();
	res.status(201).json(pointOfInterestAttachment);
});

router.put('/api/cluster/:uuid/server/:serverUuid/point-of-interest/:pointOfInterestUuid/attachment/:pointOfInterestAttachmentUuid',
	doesClusterExist, doesServerBelongToCluster, doesPointOfInterestBelongToServer, async function(req, res) {
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
	res.status(405).send(); // 'Method Not Allowed'
});

router.delete('/api/cluster/:uuid/server/:serverUuid/point-of-interest/:pointOfInterestUuid/attachment/:pointOfInterestAttachmentUuid',
	doesClusterExist, doesServerBelongToCluster, doesPointOfInterestBelongToServer, async function(req, res) {
	const pointOfInterestAttachment = PointOfInterestAttachment.findByPk(req.params['pointOfInterestAttachmentUuid']);
	await pointOfInterestAttachment.destroy();
	res.status(204).send();
});

module.exports = router;
