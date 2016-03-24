var expect = require('chai').expect;
var Queue = require('../lib/queue');

var path = require('path');


describe('queue test', function () {

	it('queue keeps some queues', function () {
		var queue = new Queue();
		expect(queue.queues.length).to.equal(0);
		queue.queue('new');
		expect(queue.queues.length).to.equal(1);
		queue.queue('reading');
		queue.queue('end');
		expect(queue.queues.length).to.equal(3);
	});


	it('queue in queue keeps some filenames', function () {
		var queue = new Queue();
		queue.queue('new').put('g:\\fimpo\\abc.txt')
				  		  .put('g:\\fimpo\\def.txt')
				  		  .put('g:\\javascript\\repo.js')
				  		  .put('g:\\fimpo\\def.txt');
		expect(queue.queue('new').length()).to.equal(3);
	});


	it('listen to event of new file reached to a queue', function (done) {
		var file = "g:\\javascript\\abc.txt";
		var qname = "new";
		var queue = new Queue();
		var queueNew = queue.queue(qname);
		queueNew.on(queue.EVENT_NEW_REACHED, function (q, filename) {
				  		expect(q.name()).to.equal(qname);
				  		expect(filename).to.equal(file);
				  		queueNew.removeAllListeners();
				  		done();
				  	});
		queue.queue(qname).put(file);
	});


	it('get an filename item from a queue', function () {

		var file1 = 'g:\\fimpo\\a.txt';
		var file2 = 'g:\\fimpo\\b.txt';
		var file3 = 'g:\\fimpo\\c.txt';

		var queue = new Queue();
		queue.queue('new').put(file1)
			 			  .put(file2)
			 			  .put(file3);

		var file = queue.queue('new').get();
		expect(file).to.equal(file1);
		file = queue.queue('new').get();
		expect(file).to.equal(file2);
		file = queue.queue('new').get();
		expect(file).to.equal(file3);		
	});


	it('a queue concat another queue to do transer files between them', function () {
		var file1 = 'g:\\fimpo\\a.txt';
		var file2 = 'g:\\fimpo\\b.txt';
		var file3 = 'g:\\fimpo\\c.txt';

		var queue = new Queue();
		queue.queue('new').put(file1)
			 			  .put(file2)
			 			  .put(file3);

		var readingqueue = queue.queue('reading');
		readingqueue.size(2);

		var file = readingqueue.get();
		expect(file).to.be.undefined;	 		

		queue.queue('new').concat(readingqueue);
		file = readingqueue.get();
		expect(file).to.equal(file1);

		file = readingqueue.get();
		expect(file).to.equal(file2);

		file = readingqueue.get();
		expect(file).to.equal(file3);
	});
});