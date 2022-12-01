// SPDX-License-Identifier: GPL-3.0-or-later
const express = require('express');
const router = express.Router();

const PointOfInterestAttachment = require('../models/PointOfInterestAttachment');

const pipeS3FileToResponse = require('../utils/pipeS3FileToResponse');
const resizeImage = require('../utils/resizeImage');
const getS3Client = require('../utils/getS3Client');

const RedisCacheProvider = require('../lib/RedisCacheProvider');

/*
 * GET /:uuid
 * Params:
 * - uuid (string)
 * Status Codes:
 * - 200
 * - 404
 */
router.get('/:uuid', async function (req, res) {
	const pointOfInterestAttachment = await PointOfInterestAttachment.findByPk(req.params['uuid']);
	if (pointOfInterestAttachment === null) {
		return res.status(404).send();
	}

	try {
		await pipeS3FileToResponse(pointOfInterestAttachment.bucketName, pointOfInterestAttachment.objectName, res);
	} catch (e) {
		console.error(e);
		res.status(500).send('Internal Error');
	}
});

/*
 * GET /:uuid/thumbnail/:wh
 * Params:
 * - uuid (string)
 * - wh (string)
 * Status Codes:
 * - 200
 * - 404
 */
router.get('/:uuid/thumbnail/:wh', async function(req, res) {
	const pointOfInterestAttachment = await PointOfInterestAttachment.findByPk(req.params['uuid']);
	if (pointOfInterestAttachment === null) {
		return res.status(404).send();
	}

	// Example: 320x240, 640x480
	const widthHeight = req.params['wh'].split('x');
	if (widthHeight.length !== 2) {
		return res.status(400).send();
	}
	const width = parseInt(widthHeight[0]);
	const height = parseInt(widthHeight[1]);

	const redisCacheProvider = new RedisCacheProvider(getS3Client());

	const redisKey = `BucketName=${pointOfInterestAttachment.bucketName} ObjectName=${pointOfInterestAttachment.objectName}`;
	const redisKeyResized = redisKey + ` Width=${width} Height=${height}`;

	// See if we have this resized image cached in Redis already.
	let imageResizedStoredData = await redisCacheProvider.getFromRedis(redisKeyResized);
	if (!imageResizedStoredData) {
		let imageStoredData;
		try {
			// If this resized image is not cached in Redis, save the original image into Redis and return it
			imageStoredData = await redisCacheProvider.saveFromS3IntoRedis(pointOfInterestAttachment.bucketName, pointOfInterestAttachment.objectName, redisKey);
		} catch (e) {
			if (e.Code === 'NoSuchKey') {
				return res.status(404).send();
			}
			console.error(e);
			return res.status(500).send('Internal Error');
		}
		// Perform the image resize according to the width/height provided.
		imageResizedStoredData = {
			contentType: imageStoredData.contentType,
			buffer: await resizeImage(imageStoredData.buffer, width, height)
		};
		// Cache this resized image into Redis, so it's faster next time and reduces the number of hits against our S3 instance.
		await redisCacheProvider.saveIntoRedis(redisKeyResized, imageResizedStoredData);
	}
	res.set({
		'Content-Type': imageResizedStoredData.contentType,
		'Content-Length': imageResizedStoredData.buffer.length
	});
	res.send(imageResizedStoredData.buffer);
});

module.exports = router;
