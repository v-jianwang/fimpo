var util = require('util');
var EventEmitter = require('events').EventEmitter;

var fs = require('fs');
var path = require('path');

exports = module.exports = new Scaner();

/*
	initialize a Scaner
*/
function Scaner (directory) {
	this.scaners = [];
	this._directory = directory || '';
	this._includesubdirectory = false;
	this._running = true;
	this._intervalID = null;

	this.EVENT_SCAN_FINISH = 'finished';
}
util.inherits(Scaner, EventEmitter);


/*
	count the number of scaner
*/
Scaner.prototype.count = function () {
	return this.scaners.length;
};



/*
	create a scaner
*/
Scaner.prototype.scan = function (directory, includesubdirectory) {
	var scaner = new Scaner(directory);
	this.scaners.push(scaner);

	var self = this;
	var include = includesubdirectory || false;
	// start a scan in child process
	scaner._scan(directory, include, function (err, list) {
		if (err)
			console.log('err: ' + err);

		self.stop(directory);
		self.emit(self.EVENT_SCAN_FINISH, directory, list);
	});

	return scaner;
};


/*
	inner scan implementation
*/
Scaner.prototype._scan = function (directory, includesubdirectory, scanDone) {
	var self = this;

	setTimeout(function () {

		(function walk(dir, done) {
			var filenames = [];
			// possible stopping point
			if (!self._running) 
				return done(null, filenames);
			
			// browse dir and browse subdir if necessary
			fs.readdirSync(dir).forEach(function (element, index, array) {
					var itemname = path.join(dir, element);

					var stats = fs.statSync(itemname);
					if (stats && stats.isDirectory() && includesubdirectory) {
						walk(itemname, done);
					}
					else if (stats && stats.isFile()) {
						filenames = filenames.concat(itemname);
					}
			});
				
			return done(null, filenames);
		})(directory, function(err, list) {
			// pass by the scan result with fullnames
			scanDone(err, list);
		});
		
	}, 20);
};


/*
	start 
*/
Scaner.prototype.start = function (paths, interval) {
	var self = this;
	var once = function () {
		paths.forEach(function (path) {
			self.scan(path);
		});
	};
	var loop = function () {
		return setInterval(once, interval);
	};

	if (interval) {
		this._intervalID = loop();
	}
	else {
		once();
	}
}


/*
	stop scaner
*/
Scaner.prototype.stop = function (directory) {

	// stop message to scan instance
	if (directory == this._directory) {
		this._running = false;
		return;
	}

	// stop message to scan container
	this.scaners.forEach(function (element, index, array) {
		if (!directory) {
			if (this._intervalID)
				clearInterval(this._intervalID);

			element.stop(element._directory);
			array.splice(index, 1);
		}
		else if (directory == element._directory) {
			element.stop(element._directory);
			array.splice(index, 1);
		}
	});
}


