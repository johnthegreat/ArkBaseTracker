const stream = require('stream');

// https://stackoverflow.com/questions/13230487/converting-a-buffer-into-a-readablestream-in-node-js
const createReadableStreamFromBuffer = function(buffer) {
	return stream.Readable.from(buffer);
};

module.exports = createReadableStreamFromBuffer;
