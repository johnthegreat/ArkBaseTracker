// SPDX-License-Identifier: GPL-3.0-or-later
const _ = require('lodash');
const express = require('express');
const router = express.Router();

const doesClusterExist = require('../middleware/doesClusterExist');

const Cluster = require('../../models/Cluster');

const allowedIncomingClusterFieldNames = ['name', 'type'];

/*
 * GET /api/cluster
 * Status Codes:
 * - 200
 * - 500
 */
router.get('/api/cluster', async function(req, res, next) {
	try {
		const clusters = await Cluster.findAll({
			order: [
				['name', 'ASC']
			]
		});
		res.json(clusters);
	} catch (err) {
		console.error(err);
		res.status(500).send('Internal Error');
	}
});

/*
 * GET /api/cluster/:uuid
 * Params:
 * - uuid (string)
 * Status Codes:
 * - 200
 * - 404
 * - 500
 */
router.get('/api/cluster/:uuid', doesClusterExist, async function(req,res) {
	const clusterId = req.params['uuid'];

	try {
		const cluster = await Cluster.findByPk(clusterId);
		res.json(cluster);
	} catch (err) {
		console.error(err);
		res.status(500).send('Internal Error');
	}
});

/*
 * POST /api/cluster
 * Body:
 * - name (string)
 * - type (string)
 * Status Codes:
 * - 201
 * - 500
 */
router.post('/api/cluster', async function(req, res) {
	try {
		const cluster = Cluster.build(_.pick(req.body, allowedIncomingClusterFieldNames));
		await cluster.save();
		res.status(201).json(cluster);
	} catch (err) {
		console.error(err);
		res.status(500).send('Internal Error');
	}
});

/*
 * DELETE /api/cluster/:uuid
 * Params:
 * - uuid (string)
 * Status Codes:
 * - 204
 * - 404
 * - 500
 */
router.delete('/api/cluster/:uuid', doesClusterExist, async function(req, res) {
	const clusterId = req.params['uuid'];

	try {
		const cluster = await Cluster.findByPk(clusterId);
		await cluster.destroy();
		res.status(204).send();
	} catch (err) {
		console.error(err);
		res.status(500).send('Internal Error');
	}
});

module.exports = router;
