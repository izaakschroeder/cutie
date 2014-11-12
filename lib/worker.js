
'use strict';

var _ = require('lodash'),
	EventEmitter = require('events').EventEmitter,
	util = require('util');

/**
 * @constructor
 * @param {Object} options Configuration options for the worker.
 * @param {Object} options.queue Queue to get jobs from.
 * @param {Function} options.work Function to call for each job.
 * @param {String} options.type Type of job to request from the queue.
 */
function Worker(options) {
	if (this instanceof Worker === false) {
		return new Worker(options);
	}

	if (!_.isObject(options)) {
		throw new TypeError();
	}

	if (!_.has(options, 'queue') || !_.isFunction(options.queue.pop)) {
		throw new TypeError();
	}

	if (!_.isFunction(options.work)) {
		throw new TypeError();
	}

	EventEmitter.call(this);
	this.queue = options.queue;
	this.work = options.work;
	this.state = Worker.State.Idle;
	this.type = options.type;
	this.count = 0;
}
util.inherits(Worker, EventEmitter);

Worker.State = {
	Idle: 'idle',
	Preparing: 'prepare',
	Running: 'run'
};

Object.defineProperty(Worker.prototype, 'state', {
	get: function getState() {
		return this.privateState;
	},
	set: function setState(state) {
		this.privateState = state;
		this.emit(state);
	}
});

/**
 * @param {Object} job Derp.
 * @returns {Object} Context for a particular job.
 */
Worker.prototype.context = function context(job) {
	var self = this;

	return {
		progress: function progress(amount) {
			self.emit('job.progress', job, amount);
		}
	};
};

/**
 * Run the worker by pulling tasks from the queue and executing the worker
 * function on them.
 * @returns {void}
 */
Worker.prototype.run = function work() {
	var self = this;

	if (self.state !== Worker.State.Idle) {
		return;
	}

	// Initially we are idle waiting for work
	self.state = Worker.State.Preparing;

	var query = {
		type: self.type
	};

	function dequeued(err, job) {

		function done(err, result) {
			// If there was an error, notify the world
			if (err) {
				self.emit('job.error', job, err);
			} else {
				// Notify the world we've completed
				self.emit('job.finish', job, result);
			}

			// Work on the next job now that we're done
			self.state = Worker.State.Idle;
		}

		// If we can't get a job from the queue
		if (err) {
			// Notify the world
			self.emit('error', err);
			self.state = Worker.State.Idle;
			return;
		}

		// Set the state
		self.state = Worker.State.Running;
		// Update number of jobs worked on
		++self.count;
		// Notify the world we're going to start work
		self.emit('job.start', job);
		// Process the job
		try {
			self.work(job, self.context(job), done);
		} catch(e) {
			done(e);
		}
	}

	self.queue.pop(query, dequeued);
};

Worker.prototype.start = function start() {
	this.on('idle', this.run);
	this.run();
};

Worker.prototype.stop = function stop() {
	this.removeListener('idle', this.run);
};

module.exports = Worker;
