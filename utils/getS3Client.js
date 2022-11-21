const {S3Client} = require("@aws-sdk/client-s3");

/**
 * @type S3Client
 */
let s3Client;

const getS3Client = function() {
	if (!s3Client) {
		s3Client = new S3Client({
			region: process.env.S3_REGION,
			endpoint: process.env.S3_ENDPOINT,
			credentials: {
				accessKeyId: process.env.S3_ACCESS_KEY,
				secretAccessKey: process.env.S3_SECRET_KEY
			}
		});
	}

	return s3Client;
};

module.exports = getS3Client;
