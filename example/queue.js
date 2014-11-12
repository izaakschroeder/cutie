
'use strict';

var _ = require('lodash'),
	EventEmitter = require('events').EventEmitter,
	util = require('util');

function Queue() {
	EventEmitter.call(this);
	this.queues = { };
}
util.inherits(Queue, EventEmitter);

Queue.prototype.queue = function queue(job) {
	if (!_.has(this.queues, job.type)) {
		this.queues[job.type] = [ ];
	}
	return this.queues[job.type];
};

Queue.prototype.pop = function pop(options, callback) {
	var result = this.queue(options).pop();
	if (result) {
		callback(null, result);
	} else {
		this.once('push', _.bind(this.pop, this));
	}
};

Queue.prototype.push = function push(job, callback) {
	this.queue(job).push(job);
	this.emit('push');
	callback();
};

module.exports = Queue;
