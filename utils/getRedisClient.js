const { createClient } = require('redis');

async function getRedisClient() {
	const redisClient = createClient({
		url: process.env.REDIS_URL
	});
	redisClient.on('error', function(err) {
		console.error('Redis Client Error', err);
	});
	await redisClient.connect();
	return redisClient;
}

module.exports = getRedisClient;
