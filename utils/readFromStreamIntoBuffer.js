// https://stackoverflow.com/questions/14269233/node-js-how-to-read-a-stream-into-a-buffer

/**
 *
 * @param stream
 * @return {Promise<Buffer>}
 */
const readFromStreamIntoBuffer = function(stream) {
	return new Promise(function(resolve, reject) {
		const buffers = [];
		stream.on('data', function(chunk) {
			buffers.push(chunk);
		});
		stream.on('end', function() {
			resolve(Buffer.concat(buffers));
		});
		stream.on('error', function(err) {
			console.error(err);
			reject(err);
		});
	});
};

module.exports = readFromStreamIntoBuffer;
