// SPDX-License-Identifier: GPL-3.0-or-later
require('dotenv').config();
const Cluster = require('../models/Cluster');

const args = process.argv.slice(2);

if (args.length < 2) {
	console.log('Usage: node create-cluster.js <name> <type>');
	process.exit(1);
}

(async function() {
	const cluster = Cluster.build({
		name: args[0],
		type: args[1]
	});
	try {
		await cluster.save();
		console.log(cluster.uuid);
	} catch (e) {
		console.error(e);
	}
})();
