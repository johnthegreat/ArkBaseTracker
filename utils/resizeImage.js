const sharp = require('sharp');

function resizeImage(imageData, width, height) {
	return sharp(imageData)
		.resize({ width: width, height: height })
		.toBuffer();
}

module.exports = resizeImage;
