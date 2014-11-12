
'use strict';

var _ = require('lodash'),
	Queue = require('queue');

describe('Queue', function() {
	describe('#constructor', function() {
		it('should fail with no arguments', function() {
			expect(Queue).to.throw(TypeError);
		});
		it('should fail with no backend', function() {
			expect(_.partial(Queue, {
				backend: null
			})).to.throw(TypeError);
		});
		it('should derp', function() {
			expect(new Queue({
				backend: { push: sinon.stub(), pop: sinon.stub() }
			})).to.not.be.null;
		});
	});

	describe('#push', function() {
		beforeEach(function() {
			this.pop = sinon.stub();
			this.push = sinon.stub();
			this.queue = new Queue({
				backend: { push: this.push, pop: this.pop }
			});
		});

		it('should call the backend push', function() {
			this.queue.push();
			expect(this.push).to.be.calledOnce;
		});
	});

	describe('#pop', function() {
		beforeEach(function() {
			this.pop = sinon.stub();
			this.push = sinon.stub();
			this.queue = new Queue({
				backend: { push: this.push, pop: this.pop }
			});
		});

		it('should call backend pop', function() {
			this.queue.pop();
			expect(this.pop).to.be.calledOnce;
		});
	});
});
