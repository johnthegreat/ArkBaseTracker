// SPDX-License-Identifier: GPL-3.0-or-later
const Server = require('../../models/Server');

async function doesServerBelongToCluster(req, res, next) {
	const clusterUuid = req.params['uuid'];
	const serverUuid = req.params['serverUuid'];

	const server = await Server.findByPk(serverUuid);
	if (!server || (server.clusterUuid !== clusterUuid)) {
		return res.status(404).send();
	}
	next();
}

module.exports = doesServerBelongToCluster;
