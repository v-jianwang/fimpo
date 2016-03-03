var expect = require('chai').expect;
var repository = require('../lib/repository');

var path = require('path');


describe('repository test', function () {
	it('repository keeps some queues', function () {
		
		expect(repository.queueCount()).to.equal(0);
		repository.queue('unread');
		expect(repository.queueCount()).to.equal(1);
		repository.queue('hasRead');
		expect(repository.queueCount()).to.equal(2);
	});


	it('queue in repository keeps some filenames', function () {
		var filename = path.join('g:', 'fimpo', 'abc.txt');
		repository.queue('unread')
				  .add('g:\\fimpo\\abc.txt')
				  .add('g:\\fimpo\\def.txt')
				  .add('g:\\javascript\\repo.js');
		expect(repository.queue('unread').length()).to.equal(3);
	})
});