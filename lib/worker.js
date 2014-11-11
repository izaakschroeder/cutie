
/**
 * @constructor
 * @param {Object} options
 * @param {Object} options.queue Queue to get jobs from.
 * @param {Function} options.work Function to call for each job.
 * @param {String} options.type Type of job to request from the queue.
 */
function Worker(options) {
	this.queue = options.queue;
	this.work = options.work;
	this.state = Worker.State.Idle;
	this.type = options.type;
	this.count = 0;
}
Worker.State = {
	Idle: 'idle',
	Running: 'running',
	Error: 'error'
}

/**
 *
 *
 */
Worker.prototype.run = function() {
	var worker = this;

	// Initially we are idle waiting for work
	worker.state = Worker.State.Idle;

	// Wait to get a job from the queue
	worker.queue.dequeue(type, function(err, job) {

		// If we can't get a job from the queue, then die
		if (err) {

		}

		// Process the job
		worker.state = Worker.State.Running;
		++worker.count;
		worker.work(job, function(err) {

			// Work on the next job now that we're done
			worker.run();
		});
	});
}

module.exports = Worker;
