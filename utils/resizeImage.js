// SPDX-License-Identifier: GPL-3.0-or-later
const sharp = require('sharp');

/**
 *
 * @param {Buffer} imageData
 * @param {number} width
 * @param {number} height
 * @returns {Promise<Buffer>}
 */
function resizeImage(imageData, width, height) {
	return sharp(imageData)
		.resize({ width: width, height: height })
		.toBuffer();
}

module.exports = resizeImage;
