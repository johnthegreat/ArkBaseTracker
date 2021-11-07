const Minio = require('minio');

let minioClient = null;

const getMinioClient = function() {
	if (minioClient === null) {
		minioClient = new Minio.Client({
			endPoint: process.env.MINIO_ENDPOINT,
			port: parseInt(process.env.MINIO_PORT),
			useSSL: process.env.MINIO_SSL === 'true',
			accessKey: process.env.MINIO_ACCESS_KEY,
			secretKey: process.env.MINIO_SECRET_KEY
		});
	}
	
	return minioClient;
};

module.exports = getMinioClient;
