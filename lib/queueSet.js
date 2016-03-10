const EventEmitter = require('events').EventEmitter;
const util = require('util');

const queue = require('./queue');


exports = module.exports = new QueueSet();



const QUEUE_NAME_NEW = 'new';
const QUEUE_NAME_READING = 'reading';
const QUEUE_NAME_END = 'end';


function QueueSet () {
	EventEmitter.call(this);
	this.EVENT_NEW_REACHED = 'new_reached';

	var newQ = queue.queue(QUEUE_NAME_NEW);	
	newQ.on(newQ.EVENT_NEW_REACHED, function (qname, filename) {
		this.emit(this.EVENT_NEW_REACHED, qname, filename);
	});

	var readingQ = queue.queue(QUEUE_NAME_READING);
	readingQ.size(5);
	newQ.concat(readingQ);

	var endQ = queue.queue(QUEUE_NAME_END);
	newQ.exclude(endQ);
}
util.inherits(QueueSet, EventEmitter);



QueueSet.prototype.clean = function () {
	queue.empty();
};


QueueSet.prototype.put = function (filename) {
	
};