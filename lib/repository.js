

exports = module.exports = new Repository();


/*
	initialize new Repository
*/
function Repository () {
	
	this.queues = [];

}


/*
	the number of queues
*/
Repository.prototype.queueCount = function () {
	return this.queues.length;
}


/*
	initialize new Queue
*/
function Queue (name) {
	this._name = name;
	this._queue = [];
}


/*
	the number of queues
*/
Repository.prototype.queue = function (name) {
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
	add filename to queue
*/
Queue.prototype.add = function (name) {
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
	}
	return this;
}

Queue.prototype.length = function () {
	return this._queue.length;
}



