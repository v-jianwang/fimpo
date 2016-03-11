var util = require('util');
var EventEmitter = require('events').EventEmitter;

var fs = require('fs');


exports = module.exports = new Watcher();


/*
	initialize a Watcher
*/
function Watcher (path) {
	this.watchers = [];
	this._path = path || '';
	this._watcher = {
		close: function () {
			console.log('nothing to be closed.');
		}
	};

	this.EVENT_FILE_REACHED = 'reached';
};
util.inherits(Watcher, EventEmitter);


/*
	count the number of watch
*/
Watcher.prototype.count = function () {
	return this.watchers.length;
};


/*
	create a watch
*/
Watcher.prototype.watch = function (path, includesubdir) {
	var watcher = new Watcher(path);
	var option = { persistent: true, recursive: includesubdir };
	var self = this;
	watcher._watcher = fs.watch(path, option, function (event, filename) {
		if (event == 'change') {
			self.emit(self.EVENT_FILE_REACHED, filename);
		}
	});

	this.watchers.push(watcher);
	return watcher;
};


/*
	remove a watch
*/
Watcher.prototype.unwatch = function (path) {
	this.watchers.forEach(function (element, index, array) {
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