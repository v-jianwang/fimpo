var Config = require('./config');
var tool = require('./tool');
var queueSet = require('./queueSet');
var processPool = require('./processPool');
var waiter = require('./waiter');
var scaner = require('./scaner');


exports = module.exports = Server;


/*
	Server construction
*/
function Server () {
	this._config = new Config();
}


/*
	start server	
*/
Server.prototype.init = function (env) {

	if (env) this._config = new Config(env);

	// check if the target paths exist... if not, create it.
	var sourcePaths = this._config.sourcePaths
	sourcePaths.forEach(function (path) {
		tool.mkdirRec(path);
	});

	// prepare the queues which would contain filenames
	queueSet.clean();
	queueSet.on(queueSet.EVENT_NEW_REACHED, function (qname, filename) {
		processPool.accept(filename);
	});

	// prepare process pool
	processPool.size(this._config.processSize);
};


/*
	start server	
*/
Server.prototype.start = function (config) {
	queueSet.clean();

	var sourcePaths = this._config.sourcePaths	
	// create waiter
	waiter.on(waiter.EVENT_FILE_REACHED, function (filename) {
		this._queueSet.put(filename);
	});
	sourcePaths.forEach(function (path) {
		waiter.wait(path, false);
	});

	// create scaner
	scaner.on(scaner.EVENT_SCAN_FINISH, function (dir, filenames) {
		this._queueSet.put(filenames);
	});
	scaner.start(sourcePaths, this._config.scanInterval);

};



/*
	stop server	
*/
Server.prototype.stop = function () {
	var sourcePaths = this._config.sourcePaths
	// dispose waiter
	waiter.removeAllListeners();
	sourcePaths.forEach(function (path) {
		waiter.unwait(path);
	});

	scaner.removeAllListeners();
	scaner.stop();	

};