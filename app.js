// SPDX-License-Identifier: GPL-3.0-or-later
const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const app = express();

const uploadRouter = require('./routes/upload');

const apiClusterController = require('./routes/api/cluster');
const apiServerController = require('./routes/api/server');
const apiPointOfInterestController = require('./routes/api/point-of-interest');
const apiPointOfInterestAttachmentController = require('./routes/api/point-of-interest-attachment');

const sequelize = require('./lib/DatabaseProvider');
(async function() {
	require('./models/Cluster');
	require('./models/Server');
	require('./models/PointOfInterest');
	require('./models/PointOfInterestAttachment');

	try {
		await sequelize.sync();
		console.log('All models were synchronized successfully.');
	} catch (e) {
		console.error(e);
	}
})();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/upload', uploadRouter);

app.use(apiClusterController);
app.use(apiServerController);
app.use(apiPointOfInterestController);
app.use(apiPointOfInterestAttachmentController);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.send();
});

module.exports = app;
