const RedisCacheProvider = require('../lib/RedisCacheProvider');
const getS3Client = require('../utils/getS3Client');

const redisCacheProvider = new RedisCacheProvider(getS3Client());

/**
 *
 * @param {string} bucketName
 * @param {string} objectName
 * @param {Response} res
 * @return {Promise<void>}
 */
const pipeS3FileToResponse = async function(bucketName, objectName, res) {
	// This function deliberately leaves off the try { } catch { } so any errors can be caught by the calling function

	const storedData = await redisCacheProvider.saveFromS3IntoRedis(bucketName, objectName, `BucketName=${bucketName} ObjectName=${objectName}`);
	res.set({
		'Content-Type': storedData.contentType,
		'Content-Length': storedData.buffer.length
	});
	res.send(storedData.buffer);
}

module.exports = pipeS3FileToResponse;
