var fs = require('fs');
var path = require('path');

exports = module.exports = Scanner;

/*
	initialize a Scanner
*/
function Scanner (queueSet, scanInterval) {
	this.scanners = [];

	this._directory = '';
	this.notify = function (dir, filenames) {
		//console.log('scanner put some files: ' + filenames);
		queueSet.put(filenames);
	}

	this._includesubdirectory = false;
	this._running = true;
	this._stopping = false;
	this._intervalID = null;
	this._scanInterval = scanInterval;

	this.EVENT_SCAN_FINISH = 'finished';
}


/*
	count the number of Scanner
*/
Scanner.prototype.count = function () {
	return this.scanners.length;
};



/*
	create a Scanner
*/
Scanner.prototype.scan = function (directory, includesubdirectory) {
	var scanner = new Scanner(directory);
	this.scanners.push(scanner);

	var self = this;
	var notify = this.notify;
	var includesubdir = includesubdirectory || false;
	// start a scan in child process
	scanner._scan(directory, includesubdir, function (err, list) {
		self.stop(directory);
		if (err) {
			console.error(err);
			return;
		}
		self.notify(directory, list);
	});

	return scanner;
};


/*
	inner scan implementation
*/
Scanner.prototype._scan = function (directory, includesubdirectory, scanDone) {
	var self = this;
	function stopping() {
		return self._stopping;
	}

	setTimeout(function () {
		
		var filenames = [];
		(function walk(dir, done) {
			// browse dir and browse subdir if necessary
			var items = fs.readdirSync(dir);
			for (var i=0; i < items.length; i++) {
				var itemname = path.join(dir, items[i]);

				var stats = fs.statSync(itemname);
				if (stopping()) {
					return;
				}
				else if (stats && stats.isDirectory() && includesubdirectory) {
					walk(itemname, done);
				}
				else if (stats && stats.isFile()) {
					done(itemname);
				}				
			}
		})(directory, function(itemname) {
			filenames = filenames.concat(itemname);
		});

		self._running = false;
		// pass by the scan result with fullnames
		scanDone(null, filenames);
		
	}, 20);
};


/*
	start 
*/
Scanner.prototype.start = function (paths) {
	var self = this;
	var interval = this._scanInterval;
	var once = function () {
		paths.forEach(function (path) {
			self.scan(path);
		});
	};
	var loop = function () {
		return setInterval(once, interval);
	};

	if (interval && !this._intervalID) {
		this._intervalID = loop();
	}
	else {
		once();
	}
}


/*
	stop Scanner
*/
Scanner.prototype.stop = function (directory) {
	// scanner instance receive message 'stop'
	if (directory == this._directory) {
		this._stopping = true;
		return;
	}
	
	// directory is null or empty indicates 
	// all of scanner instance are stopped.
	if (!directory) {
		this._stopping = true;
		if (this._intervalID) {
			clearInterval(this._intervalID);
			this._intervalID = null;
		}
		this.scanners.forEach(function (element) {
			element.stop(element._directory);
		});
		this.scanners = [];
	}
	else {
		// stop a scanner instance with specified directory
		this.scanners.forEach(function (element, index, array) {
			if (element._directory == directory) {
				element.stop(element._directory);
				array.splice(index, 1);
			}
		});
	}
}


