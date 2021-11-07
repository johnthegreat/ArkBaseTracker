require('dotenv').config();
const Server = require('../models/Server');

const args = process.argv.slice(2);

if (args.length < 3) {
	console.log('Usage: node create-poi.js <clusterUuid> <mapType> <mapNumber>');
	process.exit(1);
}

(async function() {
	const server = Server.build({
		clusterUuid: args[0],
		mapType: args[1],
		mapNumber: args[2]
	});
	try {
		await server.save();
		console.log(server.uuid);
	} catch (e) {
		console.error(e);
	}
})();
