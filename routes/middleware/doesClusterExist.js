const Cluster = require('../../models/Cluster');

const doesClusterExist = async function(req, res, next) {
	const clusterUuid = req.params['uuid'];
	const cluster = await Cluster.findByPk(clusterUuid);
	if (!cluster) {
		return res.status(404).send();
	}
	next();
};

module.exports = doesClusterExist;
