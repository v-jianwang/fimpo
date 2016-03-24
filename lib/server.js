var tool = require('./tool');
var QueueSet = require('./queueSet');
var Processor = require('./processor');

var Watcher = require('./watcher');
var Scanner = require('./scanner');



exports = module.exports = Server;


/*
	Server construction
*/
function Server (config) {
	var queueSet = new QueueSet();
	this.watcher = new Watcher(queueSet);
	this.scanner = new Scanner(queueSet, config.scanInterval);

	this.processor = new Processor(queueSet, config);

	this.directories = config.sourcePaths;
	
	function preparedirs(dirs) {
		dirs.forEach(function (dir) {
			tool.mkdirRec(dir);
		});
	}
	preparedirs(this.directories);
}



/*
	start server	
*/
Server.prototype.start = function (timeout, done) {
	// lanch watcher
	this.watcher.start(this.directories);
	// lanch scanner
	this.scanner.start(this.directories);

	setTimeout(done, timeout);
};



/*
	stop server	
*/
Server.prototype.stop = function () {
	// dispose scanner
	this.scanner.stop();
	// dispose watcher
	this.watcher.unwatch();
};