const _ = require('lodash');

const minioClient = require('../utils/getMinioClient')();
const createReadableStreamFromBuffer = require('../utils/createReadableStreamFromBuffer');
const readFromStreamIntoBuffer = require('../utils/readFromStreamIntoBuffer');
const tinifyImageFromBuffer = require('../utils/tinifyImageFromBuffer');

const TinifyImageService = function() {};
TinifyImageService.prototype.tinifyBucketObject = async function(bucketName, objectName) {
	const stat = await minioClient.statObject(bucketName, objectName);
	const dataStream = await minioClient.getObject(bucketName, objectName);
	const buffer = await readFromStreamIntoBuffer(dataStream);
	const resultData = await tinifyImageFromBuffer(buffer);
	const resultDataStream = createReadableStreamFromBuffer(resultData);
	return await minioClient.putObject(bucketName, objectName, resultDataStream, buffer.length, stat.metaData);
};
TinifyImageService.prototype.tinifyStream = async function(dataStream) {
	const bufferToProcess = await readFromStreamIntoBuffer(dataStream);
	const bufferProcessed = await tinifyImageFromBuffer(bufferToProcess);
	return createReadableStreamFromBuffer(bufferProcessed);
};

module.exports = TinifyImageService;
