// SPDX-License-Identifier: GPL-3.0-or-later
const tinify = require('tinify');
tinify.key = process.env.TINIFY_API_KEY;

const tinifyImageFromBuffer = function(imageDataBuffer) {
	return new Promise(function(resolve, reject) {
		tinify.fromBuffer(imageDataBuffer).toBuffer(function(err, resultData) {
			if (err) {
				return reject(err);
			}
			resolve(resultData);
		});
	});
};

module.exports = tinifyImageFromBuffer;
