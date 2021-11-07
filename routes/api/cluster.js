const express = require('express');
const router = express.Router();

const doesClusterExist = require('../middleware/doesClusterExist');

const Cluster = require('../../models/Cluster');

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

router.post('/api/cluster', async function(req, res) {
	try {
		const cluster = Cluster.build(req.body);
		await cluster.save();
		res.status(201).json(cluster);
	} catch (err) {
		console.error(err);
		res.status(500).send('Internal Error');
	}
});

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
