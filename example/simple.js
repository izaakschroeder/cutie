
'use strict';

var path = require('path'),
	Cutie = require(path.join(__dirname, '..')),
	Backend = require('./queue');


function work(job, context, callback) {
	console.log('Preparing order of', job.data.amount, job.data.product);
	callback();
}

var queue = new Cutie.Queue({
	backend: new Backend()
});

var worker = new Cutie.Worker({
	type: 'order',
	work: work,
	queue: queue
});

queue.push({
	type: 'order',
	data: { amount: 1, product: 'warbles' }
});

queue.push({
	type: 'order',
	data: { amount: 5, product: 'marbles' }
});

worker.start();

process.on('SIGINT', function interrupt() {
	worker.once('idle', function done() {
		process.exit(0);
	});
	worker.stop();
});
