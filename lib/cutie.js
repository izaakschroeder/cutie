
var Worker = require('./worker');

/**
* @constructor
* @param {Object} opts
*
*/
function Cutie(opts) {
	this.queue = opts.queue;
}

/**
* @param {String} type
* @param {Function} work
* @returns {Worker}
*/
Cutie.prototype.worker = function(type, work) {
	return new Worker({
		queue: this.queue,
		type: type,
		work: work
	});
}

/**
* @param {String} type
* @param {Object} data
* @returns {Job}
*/
Cutie.prototype.job = function(type, data) {
	var job = new Job({
		type: type,
		data: data
	});
	return this.queue.enqueue(job);
}

module.exports = Cutie;
