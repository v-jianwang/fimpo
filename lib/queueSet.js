var EventEmitter = require('events').EventEmitter;
var util = require('util');

var Queue = require('./queue');


exports = module.exports = QueueSet;


function QueueSet () {
	EventEmitter.call(this);
	this.EVENT_NEW_REACHED = 'new_reached';
	var self = this;

	this.QUEUE_NAME_NEW = 'new';
  	this.QUEUE_NAME_READING = 'reading';
	this.QUEUE_NAME_END = 'end';	

	this.queue = new Queue();
	var newQ = this.queue.queue(this.QUEUE_NAME_NEW);	

	newQ.on(newQ.EVENT_NEW_REACHED, function (qname, filename) {
		self.emit(self.EVENT_NEW_REACHED, filename);
	});

	var readingQ = this.queue.queue(this.QUEUE_NAME_READING);
	readingQ.size(5);
	newQ.concat(readingQ);

	var endQ = this.queue.queue(this.QUEUE_NAME_END);
	newQ.exclude(endQ);
}
util.inherits(QueueSet, EventEmitter);


QueueSet.prototype.size = function () {
	return this.queue.queues.length;
}


QueueSet.prototype.clean = function () {
	this.queue.empty();
};


QueueSet.prototype.put = function (filename) {
	var queue = this.queue;
	if (filename instanceof Array) {
		filename.forEach(function (fname) {
			queue.queue(this.QUEUE_NAME_NEW).put(fname);
		});
	}
	else {
		queue.queue(this.QUEUE_NAME_NEW).put(filename);	
	}
};


