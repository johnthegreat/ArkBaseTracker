const crypto = require('crypto');
const multer = require('multer');

const MulterMinio = require('../lib/MyMulterMinioStorageEngine');
const getMinioClient = require('./getMinioClient');
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

const createMulterInstance = function(allowedMimeTypeUploads) {
	const minioClient = getMinioClient();
	return multer({
		fileFilter: function(req, file, cb) {
			cb(null, allowedMimeTypeUploads.indexOf(file.mimetype) >= 0);
		},
		storage: new MulterMinio({
			minio: minioClient,
			bucketName: process.env.MINIO_BUCKET,
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
	});
};

module.exports = createMulterInstance;
