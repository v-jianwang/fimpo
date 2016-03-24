var expect = require('chai').expect;
var QueueSet = require('../lib/queueSet');


describe('queueSet test', function () {

	it('create a new queueSet with 3 queues', function () {
		var queueSet = new QueueSet();
		var size = queueSet.size();
		// 3 queues inside: new, reading and end;
		expect(size).to.equal(3);
	})


	it('call listener function when queueSet received a new file', function (done) {

		var queueSet = new QueueSet();
		queueSet.on(queueSet.EVENT_NEW_REACHED, function (qname, filename) {
			queueSet.removeAllListeners();
			done();
		});

		queueSet.put('g:\\test\\tmp\\queueSet\\customer.txt');
	});

});