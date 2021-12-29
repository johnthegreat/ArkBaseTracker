const express = require('express');
const router = express.Router();

const doesClusterExist = require('../middleware/doesClusterExist');
const doesServerBelongToCluster = require('../middleware/doesServerBelongToCluster');

const Server = require('../../models/Server');

router.get('/api/cluster/:uuid/server', doesClusterExist, async function(req, res, next) {
	const clusterId = req.params['uuid'];
	try {
		const servers = await Server.findAll({
			where: {
				clusterUuid: clusterId
			},
			order: [
				['serverName', 'ASC']
			]
		});
		res.json(servers);
	} catch (err) {
		console.error(err);
		res.status(500).send('Internal Error');
	}
});

router.get('/api/cluster/:uuid/server/:serverUuid', doesClusterExist, doesServerBelongToCluster, async function(req, res) {
	const serverId = req.params['serverUuid'];
	try {
		const server = await Server.findByPk(serverId);
		res.json(server);
	} catch (err) {
		console.error(err);
		res.status(500).send('Internal Error');
	}
});

router.post('/api/cluster/:uuid/server', doesClusterExist, async function(req,res) {
	req.body['clusterUuid'] = req.params['uuid'];
	try {
		const server = Server.build(req.body);
		await server.save();
		res.status(201).json(server);
	} catch (err) {
		console.error(err);
		res.status(500).send('Internal Error');
	}
});

router.put('/api/cluster/:uuid/server/:serverUuid', doesClusterExist, doesServerBelongToCluster, async function(req, res) {
	try {
		const server = Server.build(req.body);
		await server.save();
		res.status(201).json(server);
	} catch (err) {
		console.error(err);
		res.status(500).send('Internal Error');
	}
});

router.delete('/api/cluster/:uuid/server/:serverUuid', doesClusterExist, doesServerBelongToCluster, async function(req,res) {
	try {
		const server = await Server.findByPk(req.params['serverUuid']);
		await server.destroy();
		res.status(204).send();
	} catch (err) {
		console.error(err);
		res.status(500).send('Internal Error');
	}
});

module.exports = router;
