var fs = require('fs');
var path = require('path');


exports = module.exports = Watcher;


/*
	initialize a Watcher
*/
function Watcher (queueSet) {

	this.watchers = [];
	this._directory = '';

	this.notify = function (filename) {
		//console.log('watcher put a file: ' + filename);
		queueSet.put(filename);
	}

	this._watcher = {
		close: function () {
			console.log('nothing to be closed.');
		}
	};

	this.EVENT_FILE_REACHED = 'reached';
};


/*
	count the number of watch
*/
Watcher.prototype.count = function () {
	return this.watchers.length;
};



Watcher.prototype.start = function(directories) {
	var self = this;
	directories.forEach(function(dir) {
		self.watch(dir);
	});	
}



/*
	create a watch
*/
Watcher.prototype.watch = function (directory) {
	var watcher = new Watcher();
	watcher._directory = directory;
	var option = { persistent: true, recursive: false };
	var notify = this.notify;

	watcher._watcher = fs.watch(directory, option, function (event, filename) {
		if (event == 'change') {
			// console.log('filename: ' + filename);
			filename = path.join(directory, filename);
			notify(filename);
		}
	});

	this.watchers.push(watcher);
	return watcher;
};


/*
	remove a watch
*/
Watcher.prototype.unwatch = function (directory) {
	if (!directory) {
		this.watchers.forEach(function (w) {
			w._watcher.close();
		});
		this.watchers = [];
	}
	else {
		this.watchers.forEach(function (element, index, array) {
			if (element._directory == directory) {
				element._watcher.close();
				array.splice(index, 1);				
			}
		});
	}
};