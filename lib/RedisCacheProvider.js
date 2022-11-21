const {GetObjectCommand} = require("@aws-sdk/client-s3");
const getRedisClient = require("../utils/getRedisClient");

function RedisCacheProvider(s3Client) {
	this.s3Client = s3Client;
}

/**
 * @typedef StoredData
 * @property {string} contentType
 * @property {Buffer} buffer
 */

/**
 *
 * @param {string} s3ObjectName
 * @param {string} s3BucketName
 * @param {string} redisKey
 * @returns {Promise<StoredData>}
 */
RedisCacheProvider.prototype.saveFromS3IntoRedis = async function(s3BucketName, s3ObjectName, redisKey) {
	let storedData = await this.getFromRedis(redisKey);
	if (!storedData) {
		storedData = await this.getFromS3(s3BucketName, s3ObjectName);
		await this.saveIntoRedis(redisKey, storedData);
	}
	return storedData;
};

/**
 *
 * @param {string} s3BucketName
 * @param {string} s3ObjectKey
 * @returns {Promise<StoredData>}
 */
RedisCacheProvider.prototype.getFromS3 = async function getFromS3(s3BucketName, s3ObjectKey) {
	const s3Data = await this.s3Client.send(new GetObjectCommand({
		Bucket: s3BucketName,
		Key: s3ObjectKey
	}));
	return {
		contentType: s3Data.ContentType,
		buffer: Buffer.from(await s3Data.Body.transformToByteArray())
	};
}

/**
 *
 * @param {string} redisKey
 * @returns {Promise<StoredData>}
 */
RedisCacheProvider.prototype.getFromRedis = async function getFromRedis(redisKey) {
	const redisClient = await getRedisClient();
	const data = await redisClient.get(redisKey);
	if (!data) {
		return undefined;
	}
	const storedData = JSON.parse(data);
	if (storedData.buffer) {
		storedData.buffer = Buffer.from(storedData.buffer, 'base64');
	}
	return storedData;
}

/**
 *
 * @param {string} redisKey
 * @param {StoredData} data
 * @returns {Promise<void>}
 */
RedisCacheProvider.prototype.saveIntoRedis = async function saveIntoRedis(redisKey, data) {
	const redisClient = await getRedisClient();
	const dataToSave = JSON.stringify({
		contentType: data.contentType,
		buffer: data.buffer ? data.buffer.toString('base64') : null
	});
	await redisClient.setEx(
		redisKey,
		86400 * 30,
		dataToSave,
	);
}

module.exports = RedisCacheProvider;
