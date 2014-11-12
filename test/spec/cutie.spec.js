
'use strict';

var cutie = require('cutie');

describe('Cutie', function() {
	it('should export Worker', function() {
		expect(cutie).to.have.property('Worker');
	});
	it('should export Queue', function() {
		expect(cutie).to.have.property('Queue');
	});
});
