// SPDX-License-Identifier: GPL-3.0-or-later
require('dotenv').config();
const Server = require('../models/Server');

const args = process.argv.slice(2);

if (args.length < 3) {
	console.log('Usage: node create-server.js <clusterUuid> <serverName> <mapType>');
	process.exit(1);
}

(async function() {
	const server = Server.build({
		clusterUuid: args[0],
		serverName: args[1],
		mapType: args[2]
	});
	try {
		await server.save();
		console.log(server.uuid);
	} catch (e) {
		console.error(e);
	}
})();
