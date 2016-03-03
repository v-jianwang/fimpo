var util = require('util');
var EventEmitter = require('events').EventEmitter;

var fs = require('fs');


exports = module.exports = new Waiter();


/*
	initialize a Waiter
*/
function Waiter (path) {
	this.waiters = [];
	this._path = path || '';
	this._watcher = {
		close: function () {
			console.log('nothing to be closed.');
		}
	};
};
util.inherits(Waiter, EventEmitter);


/*
	count the number of wait
*/
Waiter.prototype.count = function () {
	return this.waiters.length;
};


/*
	create a wait
*/
Waiter.prototype.wait = function (path, includesubdir) {
	var waiter = new Waiter(path);
	var option = { persistent: true, recursive: includesubdir };
	var self = this;
	waiter._watcher = fs.watch(path, option, function (event, filename) {
		if (event == 'change') {
			self.emit('reached', filename);
		}
	});

	this.waiters.push(waiter);
	return waiter;
};


/*
	remove a wait
*/
Waiter.prototype.unwait = function (path) {
	this.waiters.forEach(function (element, index, array) {
		if (!path) {
			element._watcher.close();
			array.splice(index, 1);
		}
		else if (path == element._path) {
			element._watcher.close();
			array.splice(index, 1);
		}
	});
};