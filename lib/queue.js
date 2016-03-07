var EventEmitter = require('events').EventEmitter;
var util = require('util');

exports = module.exports = new Queue();


/*
	initialize new Queue
*/
function Queue (name) {
	this.queues = [];

	this._name = name || '';
	this._queue = [];
	this._size = 0;
	this._prevQ = {};
}
util.inherits(Queue, EventEmitter);



/*
	return length of current queue
*/
Queue.prototype.length = function () {
	return this._queue.length;
}


/*
	return name of current queue
*/
Queue.prototype.name = function () {
	return this._name;
}


/*
	the number of queues
*/
Queue.prototype.queue = function (name) {
	var self = this;

	function _searchQueue() {
		var que = null;
		self.queues.forEach(function (element) {
			if (name == element._name)
				que = element;
		});
		return que;
	}

	var queue = _searchQueue();
	if (!queue) {
		queue = new Queue(name);
		this.queues.push(queue);
	}

	return queue;
}


/*
	clean all the queues in repository
*/
Queue.prototype.empty = function () {
	this.queues = [];
};


/*
	queue A concat queue B, which makes file put in end of queue B is read 
	from the head of queueA
*/
Queue.prototype.concat = function (queue) {
	queue._prevQ = this;
};


/*
	put filename into queue
*/
Queue.prototype.put = function (name) {
	var self = this;

	function _search() {
		var f = null;
		self._queue.forEach(function (element) {
			if (name == element)
				f = element;
		});
		return f;
	}

	var filename = _search();
	if (!filename) {
		this._queue.push(name);
		this.emit('reached', this, name);
	}
	return this;
}


/*
	get filename from queue
*/
Queue.prototype.get = function () {
	var item = this._queue.shift();

	if (!item && this._prevQ._name) {
		var batch = this._size || 5;

		for (var i = 0; i < batch; i++) {
			item = this._prevQ.get();
			if (!item) break;
			this._queue.push(item);
		}

		item = this._queue.shift();
	}
	return item;
}

/*
	set max size of the queue
*/
Queue.prototype.size = function (size) {
	this._size = size;
}


