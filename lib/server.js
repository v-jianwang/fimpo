var config = require('./config');
var tool = require('./tool');
var queue = require('./queue');

exports = module.exports = new Server();


/*
	Server construction
*/
function Server () {
	this._config = config();
	this._queueSet = queue;
}

/*
	start server	
*/
Server.prototype.init = function (env) {

	if (env) this._config = config(env);

	// check if the target paths exist... if not, create it.
	var targetpaths = this._config.targetpaths
	targetpaths.forEach(function (path) {
		tool.mkdirRec(path);
	});

	// prepare the queues which would contain filenames
	this._queueSet.empty();

	// prepare process pool

};


/*
	start server	
*/
Server.prototype.start = function (config) {
	// body...
};



/*
	stop server	
*/
Server.prototype.stop = function () {
	// body...
};