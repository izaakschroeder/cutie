
'use strict';

var _ = require('lodash');

function Queue(opts) {
	if (this instanceof Queue === false) {
		return new Queue(opts);
	}
	if (!_.has(opts, 'backend') || !_.isFunction(opts.backend.push)) {
		throw new TypeError();
	}
	this.backend = opts.backend;
}

Queue.prototype.pop = function pop(options, callback) {
	this.backend.pop(options, callback || _.noop);
};

/**
* @param {Object} job Job to submit to the queue
* @param {Number} job.timeout How to long to wait from job inactivity before marking it as failed.
* @param {String} job.type Type of job.
* @param {Object} job.data Data associated with the job.
* @param {Function} callback Called when the job has been put into the queue.
* @returns {void}
*/
Queue.prototype.push = function push(job, callback) {
	this.backend.push(job, callback || _.noop);
};

module.exports = Queue;
