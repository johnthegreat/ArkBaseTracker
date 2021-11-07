const express = require('express');
const router = express.Router();

const PointOfInterestAttachment = require('../models/PointOfInterestAttachment');
const pipeMinioFileToResponse = require('../utils/pipeMinioFileToResponse');

const minioClient = require('../utils/getMinioClient')();
const resizeImage = require('../utils/resizeImage');
const createReadableStreamFromBuffer = require('../utils/createReadableStreamFromBuffer');
const readFromStreamIntoBuffer = require('../utils/readFromStreamIntoBuffer');

router.get('/:uuid', async function (req, res) {
	const pointOfInterestAttachment = await PointOfInterestAttachment.findByPk(req.params['uuid']);
	if (pointOfInterestAttachment === null) {
		return res.status(404).send();
	}

	await pipeMinioFileToResponse(pointOfInterestAttachment.bucketName, pointOfInterestAttachment.objectName, res);
});

router.get('/:uuid/thumbnail/:wh', async function(req, res) {
	const pointOfInterestAttachment = await PointOfInterestAttachment.findByPk(req.params['uuid']);
	if (pointOfInterestAttachment === null) {
		return res.status(404).send();
	}

	const widthHeight = req.params['wh'].split('x');
	const width = parseInt(widthHeight[0]);
	const height = parseInt(widthHeight[1]);

	const dataStream = await minioClient.getObject(pointOfInterestAttachment.bucketName, pointOfInterestAttachment.objectName);
	const dataBuffer = await readFromStreamIntoBuffer(dataStream);
	createReadableStreamFromBuffer(await resizeImage(dataBuffer, width, height)).pipe(res);
});

module.exports = router;
