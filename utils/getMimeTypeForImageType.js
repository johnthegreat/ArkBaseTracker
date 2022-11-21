// One of: jpeg, png, webp, gif, svg
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types

/**
 *
 * @param {string} imageType
 * @returns {string|undefined}
 */
function getMimeTypeForImageType(imageType) {
	switch(imageType) {
		case 'jpeg':
			return 'image/jpeg';
		case 'png':
			return 'image/png';
		case 'webp':
			return 'image/webp';
		case 'gif':
			return 'image/gif';
		case 'svg':
			return 'image/svg+xml';
		default:
			return undefined;
	}
}

module.exports = getMimeTypeForImageType;
