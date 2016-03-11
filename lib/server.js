var tool = require('./tool');
var queueSet = require('./queueSet');
var pocessor = require('./Processor');
var watcher = require('./watcher');
var scanner = require('./scanner');


exports = module.exports = Server;


/*
	Server construction
*/
function Server (config) {
	this.config = config;
}


/*
	start server	
*/
Server.prototype.init = function () {

	// check if the target paths exist... if not, create it.
	var sourcePaths = this.config.sourcePaths
	sourcePaths.forEach(function (path) {
		tool.mkdirRec(path);
	});


	// prepare the queues which would contain filenames
	queueSet.clean();
	// prepare process pool
	pocessor.size(this.config.processSize);	
	queueSet.on(queueSet.EVENT_NEW_REACHED, function (qname, filename) {
		pocessor.accept(filename, function (table) {
			// body...
		});
	});


	// listen to watcher and scanner
	watcher.on(watcher.EVENT_FILE_REACHED, function (filename) {
		this._queueSet.put(filename);
	});	
	scanner.on(scanner.EVENT_SCAN_FINISH, function (dir, filenames) {
		this._queueSet.put(filenames);
	});	
};


/*
	start server	
*/
Server.prototype.start = function () {
	queueSet.clean();

	var sourcePaths = this.config.sourcePaths	
	// create watcher

	sourcePaths.forEach(function (path) {
		watcher.watch(path, false);
	});

	// create scanner

	scanner.start(sourcePaths, this.config.scanInterval);

};



/*
	stop server	
*/
Server.prototype.stop = function () {
	var sourcePaths = config.sourcePaths
	// dispose watcher
	watcher.removeAllListeners();
	sourcePaths.forEach(function (path) {
		watcher.unwatch(path);
	});

	scanner.removeAllListeners();
	scanner.stop();	

};