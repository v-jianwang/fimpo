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
}
util.inherits(Scaner, EventEmitter);


/*
	count the number of scaner
*/
Scaner.prototype.count = function () {
	return this.scaners.length;
};


/*
	property setting indicates if it'll scan subdirectory
*/
Scaner.prototype.includesubdirectory = function (include) {
	this._includesubdirectory = include;
	return this;
}


/*
	create a scaner
*/
Scaner.prototype.scan = function (directory) {
	var scaner = new Scaner(directory)
	this.scaners.push(scaner);

	var self = this;
	// start a scan in child process
	scaner._scan(directory, function (err, list) {
		if (err)
			console.log('err: ' + err);

		self.stop(directory);
		self.emit('finished', directory, list);
	});

	return scaner;
};


/*
	inner scan implementation
*/
Scaner.prototype._scan = function (directory, scanDone) {
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
					if (stats && stats.isDirectory() && self._includesubdirectory) {
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
	stop scaner
*/
Scaner.prototype.stop = function (directory) {
	if (directory == this._directory) {
		this._running = false;
		return;
	}

	this.scaners.forEach(function (element, index, array) {
		if (!directory) {
			element.stop(element._directory);
			array.splice(index, 1);
		}
		else if (directory == element._directory) {
			element.stop(element._directory);
			array.splice(index, 1);
		}
	});
}