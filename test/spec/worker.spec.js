
'use strict';

var _ = require('lodash'),
	Worker = require('worker');

describe('Worker', function() {

	beforeEach(function() {
		this.sandbox = sinon.sandbox.create();
		this.queue = {
			push: sinon.stub(),
			pop: sinon.stub()
		};
		this.worker = new Worker({
			queue: this.queue,
			work: sinon.stub()
		});
	});

	afterEach(function() {
		sinon.sandbox.restore();
	});

	describe('#constructor', function() {
		it('should fail with no arguments', function() {
			expect(Worker).to.throw(TypeError);
		});
		it('should fail with no queue', function() {
			expect(_.partial(Worker, {
				queue: null
			})).to.throw(TypeError);
		});
		it('should fail with no work function', function() {
			expect(_.partial(Worker, {
				queue: {}
			})).to.throw(TypeError);
		});
		it('should fail with an invalid work function', function() {
			expect(_.partial(Worker, {
				queue: { pop: sinon.stub() },
				work: 55
			})).to.throw(TypeError);
		});
		it('should be in the idle state', function() {
			expect(new Worker({
				queue: { pop: sinon.stub() },
				work: function() { }
			})).to.have.property('state', 'idle');
		});
	});

	describe('#run', function() {

		it('should emit `error` if there is an error fetching from queue', function() {
			this.sandbox.stub(this.worker, 'emit');
			this.queue.pop.callsArgWith(1, 'test');
			this.worker.run();
			expect(this.worker.emit).to.be.calledWith('error', 'test');
		});

		it('should emit `job.error` if job processing errors', function() {
			var job = { };
			this.sandbox.stub(this.worker, 'emit');
			this.queue.pop.callsArgWith(1, null, job);
			this.worker.work.callsArgWith(2, 'test');
			this.worker.run();
			expect(this.worker.emit).to.be.calledWith('job.error', job, 'test');
		});

		it('should emit `job.error` if job throws an exception', function() {
			var job = { }, error = new Error();
			this.sandbox.stub(this.worker, 'emit');
			this.queue.pop.callsArgWith(1, null, job);
			this.worker.work.throws(error);
			this.worker.run();
			expect(this.worker.emit).to.be.calledWith('job.error', job, error);
		});

		it('should emit `job.start` when a new job has begun running', function() {
			var job = { };
			this.sandbox.stub(this.worker, 'emit');
			this.queue.pop.callsArgWith(1, null, job);
			this.worker.run();
			expect(this.worker.emit).to.be.calledWith('job.start', job);
		});

		it('should emit `job.finish` when a job has completed succesfully', function() {
			var job = { };
			this.sandbox.stub(this.worker, 'emit');
			this.queue.pop.callsArgWith(1, null, job);
			this.worker.work.callsArgWith(2, null, 'test');
			this.worker.run();
			expect(this.worker.emit).to.be.calledWith('job.finish', job, 'test');
		});

		it('should not run if work is already occuring', function() {
			this.worker.state = Worker.State.Running;
			this.sandbox.stub(this.worker, 'emit');
			this.worker.run();
			expect(this.worker.emit).to.not.beCalled;
		});

		it('should continue the work cycle after finishing a job', function() {

		});
	});

	describe('#start', function() {
		it('should start work when the worker is idle', function() {
			this.sandbox.stub(this.worker, 'run');
			this.worker.start();
			this.worker.emit('idle');
			expect(this.worker.run).to.be.calledTwice;
		});
		it('should kick off the work queue', function() {
			this.sandbox.stub(this.worker, 'run');
			this.worker.start();
			expect(this.worker.run).to.be.calledOnce;
		});
	});

	describe('#stop', function() {
		it('should stop listening to idle events', function() {
			this.worker.stop();
			this.worker.emit('idle');
			expect(this.worker.run).to.not.beCalled;
		});
	});

	describe('#context', function() {
		it('should create an object', function() {
			var context = this.worker.context({ });
			expect(context).to.not.be.null;
		});

		it('progress object should trigger progress event', function() {
			var job = { },
				context = this.worker.context(job);
			this.sandbox.stub(this.worker, 'emit');
			context.progress(1);
			expect(this.worker.emit).to.be.calledWith('job.progress', job, 1);
		});
	});
});
