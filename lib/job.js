
/**
 * @constructor
 * @param {Object} opts
 * @param {Number} opts.attempts Number of times job has been run unsuccessfully.
 * @param {Number} opts.timeout How to long to wait from job inactivity before marking it as failed.
 * @param {String} opts.type Type of job.
 * @param {Object} opts.data Data associated with the job.
 * @param {Object} opts.receipt
 */
function Job(opts) {
	if (!opts.type) {
		throw new TypeError();
	}

	this.attempts = opts.attempts || 0;
	this.timeout = opts.timeout || 0;
	this.data = opts.data || null;
	this.type = opts.type;
}


module.exports = Job;
