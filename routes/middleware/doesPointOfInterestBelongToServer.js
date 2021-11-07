const PointOfInterest = require('../../models/PointOfInterest');

async function doesPointOfInterestBelongToServer(req, res, next) {
	const serverUuid = req.params['serverUuid'];
	const pointOfInterestUuid = req.params['pointOfInterestUuid'];

	const pointOfInterest = await PointOfInterest.findByPk(pointOfInterestUuid);
	if (!pointOfInterest || (pointOfInterest.serverUuid !== serverUuid)) {
		return res.status(404).send();
	}
	next();
}

module.exports = doesPointOfInterestBelongToServer;
