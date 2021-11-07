// Adapted from https://github.com/SaeedSheikhi/multer-minio-storage-engine/blob/master/index.js

function MyMinioStorageEngine (opts) {
	const promisifyStream = function(stream) {
		return new Promise(function(resolve) {
			resolve(stream);
		});
	};

	this.minio = opts.minio;
	this.bucketName = opts.bucketName;
	this.metaData = opts.metaData;
	this.objectName = opts.objectName;
	this.streamProcessor = opts.streamProcessor || promisifyStream;
}

MyMinioStorageEngine.prototype._handleFile = function (req, file, cb) {
	const _this = this;
	_this.objectName(req, file, function(err, objectName) {
		if (err) {
			return cb(err);
		}

		_this.metaData(req, file, function(err, metaData) {
			if (err) {
				return cb(err);
			}

			_this.streamProcessor(file.stream).then(function(stream) {
				_this.minio.putObject(_this.bucketName, objectName, stream, metaData, function(err, etag) {
					if (err) {
						return cb(err);
					}

					cb(null, {
						bucketName: _this.bucketName,
						objectName: objectName,
						metaData: metaData,
						etag: etag,
					});
				});
			});
		});
	});
};

MyMinioStorageEngine.prototype._removeFile = function (req, file, cb) {
	this.minio.removeObject(file.bucketName, file.objectName, cb);
};

module.exports = MyMinioStorageEngine;
