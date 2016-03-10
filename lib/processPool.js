exports = module.exports = new ProcessPool();

function ProcessPool (size) {
	this._size = size;
	this._pool = [];
}


/*
	set the number of processUnits
*/
ProcessPool.prototype.size = function (size) {
	this._size = size || this._size;
	return this._size;
};


ProcessPool.prototype.accept = function (filename) {
	// body...
}