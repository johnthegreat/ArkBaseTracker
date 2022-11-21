const _ = require('lodash');

const createReadableStreamFromBuffer = require('../utils/createReadableStreamFromBuffer');
const readFromStreamIntoBuffer = require('../utils/readFromStreamIntoBuffer');
const tinifyImageFromBuffer = require('../utils/tinifyImageFromBuffer');

const TinifyImageService = function() {};
TinifyImageService.prototype.tinifyStream = async function(imageDataStream) {
	const bufferToProcess = await readFromStreamIntoBuffer(imageDataStream);
	const bufferProcessed = await tinifyImageFromBuffer(bufferToProcess);
	return createReadableStreamFromBuffer(bufferProcessed);
};

module.exports = TinifyImageService;
