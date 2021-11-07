require('dotenv').config();
const PointOfInterest = require('../models/PointOfInterest');

const args = process.argv.slice(2);

if (args.length < 5) {
	console.log('Usage: node create-poi.js <serverUuid> <type> <ownerName> <lat> <lng>');
	process.exit(1);
}

(async function() {
	const pointOfInterest = PointOfInterest.build({
		serverUuid: args[0],
		type: args[1],
		ownerName: args[2],
		lat: parseFloat(args[3]),
		lng: parseFloat(args[4])
	});
	try {
		await pointOfInterest.save();
		console.log(pointOfInterest.uuid);
	} catch (e) {
		console.error(e);
	}
})();
