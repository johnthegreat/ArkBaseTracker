// SPDX-License-Identifier: GPL-3.0-or-later
const sharp = require('sharp');

const bufferHasImageData = function(buffer) {
	return new Promise(function(resolve) {
		sharp(buffer).metadata().then(function() {
			resolve(true);
		}).catch(function() {
			resolve(false);
		});
	});
};

module.exports = bufferHasImageData;
