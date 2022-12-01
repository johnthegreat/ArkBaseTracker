// SPDX-License-Identifier: GPL-3.0-or-later
const _ = require('lodash');
const express = require('express');
const router = express.Router();

const doesClusterExist = require('../middleware/doesClusterExist');
const doesServerBelongToCluster = require('../middleware/doesServerBelongToCluster');

const Server = require('../../models/Server');

const allowedIncomingServerFieldNames = ['serverName', 'mapType'];

/*
 * GET /api/cluster/:uuid/server
 * Params:
 * - uuid (string)
 * Status Codes:
 * - 200
 * - 404
 * - 500
 */
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

/*
 * GET /api/cluster/:uuid/server/:serverUuid
 * Params:
 * - :uuid (string)
 * - :serverUuid (string)
 * Status Codes:
 * - 200
 * - 404
 * - 500
 */
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

/*
 * POST /api/cluster/:uuid/server
 * Params:
 * - uuid (string)
 * Body:
 * - serverName (string)
 * - mapType (string)
 * Status Codes:
 * - 201
 * - 404
 * - 500
 */
router.post('/api/cluster/:uuid/server', doesClusterExist, async function(req,res) {
	try {
		const server = Server.build(_.pick(req.body, allowedIncomingServerFieldNames));
		server.clusterUuid = req.params['uuid'];
		await server.save();
		res.status(201).json(server);
	} catch (err) {
		console.error(err);
		res.status(500).send('Internal Error');
	}
});

/*
 * PUT /api/cluster/:uuid/server/:serverUuid
 * Params:
 * - uuid (string)
 * - serverUuid (string)
 * Body:
 * - serverName (string)
 * - mapType (string)
 * Status Codes
 * - 200
 * - 404
 * - 500
 */
router.put('/api/cluster/:uuid/server/:serverUuid', doesClusterExist, doesServerBelongToCluster, async function(req, res) {
	try {
		const server = Server.findOne({
			where: {
				clusterUuid: req.params['uuid'],
				uuid: req.params['serverUuid']
			}
		});
		const postBody = _.pick(req.body, allowedIncomingServerFieldNames);
		if (postBody['serverName'] && _.isString(postBody['serverName'])) {
			server.serverName = postBody['serverName'];
		}
		if (postBody['mapType'] && _.isString(postBody['mapType'])) {
			server.mapType = postBody['mapType'];
		}
		await server.save();
		res.status(200).json(server);
	} catch (err) {
		console.error(err);
		res.status(500).send('Internal Error');
	}
});

/*
 * DELETE /api/cluster/:uuid/server/:serverUuid
 * Params:
 * - uuid (string)
 * - serverUuid (string)
 * Status Codes:
 * - 204
 * - 404
 * - 500
 */
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
