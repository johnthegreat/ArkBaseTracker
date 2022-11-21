const crypto = require('crypto');
const multer = require('multer');
const debug = require('debug')('arkbasetracker:server');

const MyMulterStorageEngine = require('../lib/MyMulterStorageEngine');
const getS3Client = require('./getS3Client');
const TinifyImageService = require('../lib/TinifyImageService');
const tinifyImageService = new TinifyImageService();

const sha1 = function(str) {
	const hash = crypto.createHash('sha1');
	hash.update(str);
	return hash.digest('hex');
};

function getExtByMimeType(mimeType) {
	if (mimeType === 'image/png') {
		return 'png';
	} else if (mimeType === 'image/jpeg') {
		return 'jpg';
	} else if (mimeType === 'image/gif') {
		return 'gif';
	}
	return null;
}

/**
 *
 * @param {string[]} allowedMimeTypeUploads
 * @returns {Multer}
 */
const createMulterInstance = function(allowedMimeTypeUploads) {
	const s3Client = getS3Client();
	const myMulterStorageEngine = new MyMulterStorageEngine({
		s3Client: s3Client,
		bucketName: process.env.S3_BUCKET,
		metaData: function (req, file, cb) {
			cb(null, {
				fieldName: file.fieldname,
				"Content-Type": file.mimetype
			});
		},
		objectName: function (req, file, cb) {
			cb(null, sha1(crypto.randomBytes(32)) + "." + getExtByMimeType(file.mimetype));
		},
		streamProcessor: (function() {
			if (process.env.TINIFY_API_KEY) {
				return tinifyImageService.tinifyStream;
			}
			return null;
		})()
	})
	return multer({
		fileFilter: function(req, file, cb) {
			const isFileTypeAllowed = allowedMimeTypeUploads.indexOf(file.mimetype) >= 0;
			if (!isFileTypeAllowed) {
				debug(`Rejecting file \"${file.originalname}\" due to unacceptable file mimetype: \"${file.mimetype}\"`);
			}
			cb(null, isFileTypeAllowed);
		},
		limits: {
			fileSize: 1048576 * 10 // 10 MB
		},
		storage: myMulterStorageEngine
	});
};

module.exports = createMulterInstance;
