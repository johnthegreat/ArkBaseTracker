const minioClient = require('./getMinioClient')();

/**
 *
 * @param {string} bucketName
 * @param {string} objectName
 * @param {Response} res
 * @return {Promise<void>}
 */
const pipeMinioFileToResponse = async function(bucketName, objectName, res) {
	// This function deliberately leaves off the try { } catch { } so any errors can be caught by the calling function

	let stat = null;
	try {
		stat = await minioClient.statObject(bucketName, objectName);
	} catch (e) {
		console.error(e);
		return res.status(404).send();
	}
	res.set('Content-Type', stat['metaData']['content-type'] || 'binary/octet-stream');
	if (stat['size'] !== null) {
		res.set('Content-Length', stat['size']);
	}
	const dataStream = await minioClient.getObject(bucketName, objectName);
	dataStream.pipe(res);
}

module.exports = pipeMinioFileToResponse;
