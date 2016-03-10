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
	this._prevQ = null;
	this._excludeQ = null;

	this.EVENT_NEW_REACHED = 'new_reached';
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
	put filename into queue
*/
Queue.prototype.put = function (name) {
	function _searchItem(queue) {
		var f = null;
		queue.forEach(function (element) {
			if (name == element)
				f = element;
		});
		return f;
	}

	if (_searchItem(this._queue)) 
		return this;

	if (this._excludeQ && _searchItem(this._excludeQ))
		return this;
	
	this._queue.push(name);
	this.emit(this.EVENT_NEW_REACHED, this, name);	
	return this;
}


/*
	get filename from queue
*/
Queue.prototype.get = function () {
	var item = this._queue.shift();

	if (!item && this._prevQ) {
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


/*
	queueA.concat(queueB), that means that items in queueA will auto be moved 
	to queueB if queueB is empty. This is one of the rules between Queues.
*/
Queue.prototype.concat = function (queue) {
	queue._prevQ = this;
};


/*
	queueA.exclude(queueB), that means that item is NOT allowed to enter queueA
	if it has been in queueB. This is one of the rules between Queues.
*/
Queue.prototype.exclude = function (queue) {
	this._excludeQ = queue;
}