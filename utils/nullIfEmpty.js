const _ = require('lodash');

const nullIfEmpty = function(value) {
	if (_.isString(value) && value.length === 0) {
		return null;
	}
	return value;
};

module.exports = nullIfEmpty;
