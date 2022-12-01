// SPDX-License-Identifier: GPL-3.0-or-later
const {PutObjectCommand, DeleteObjectCommand} = require('@aws-sdk/client-s3');
const readFromStreamIntoBuffer = require('../utils/readFromStreamIntoBuffer');

function MyMulterStorageEngine (opts) {
	const promisifyStream = function(stream) {
		return new Promise(function(resolve) {
			resolve(stream);
		});
	};

	this.s3Client = opts.s3Client;
	this.bucketName = opts.bucketName;
	this.metaData = opts.metaData;
	this.objectName = opts.objectName;
	this.streamProcessor = opts.streamProcessor || promisifyStream;
}

MyMulterStorageEngine.prototype._handleFile = function (req, file, cb) {
	const _this = this;
	_this.objectName(req, file, function(err, objectName) {
		if (err) {
			return cb(err);
		}

		_this.metaData(req, file, function(err, metaData) {
			if (err) {
				return cb(err);
			}

			_this.streamProcessor(file.stream).then(async function(stream) {
				/*
				 * Seem to have to read the entire Stream into a buffer
				 * I was getting Missing required Content-Length HTTP header (even though I was passing
				 *   it a stream, so I had no way of knowing how much data the stream contained)
				 * This will cause memory usage to briefly spike during uploads
				 * https://github.com/aws/aws-sdk-js/issues/2961
				 */
				const body = await readFromStreamIntoBuffer(stream);
				const payload = {
					Bucket: _this.bucketName,
					Key: objectName,
					Body: body,
					Metadata: metaData,
					ContentType: metaData['Content-Type']
				};
				await _this.s3Client.send(new PutObjectCommand(payload));
				cb(null, {
					bucketName: _this.bucketName,
					objectName: objectName,
					metaData: metaData
				});
			});
		});
	});
};

MyMulterStorageEngine.prototype._removeFile = function (req, file, cb) {
	this.s3Client.send(new DeleteObjectCommand({
		Bucket: file.bucketName,
		Key: file.objectName
	})).then(function() {
		cb();
	}).catch(function(err) {
		cb(err);
	});
};

module.exports = MyMulterStorageEngine;
