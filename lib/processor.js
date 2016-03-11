var ProcessUnit = require('./processUnit');

exports = module.exports = new Processor();


var pool = [];
var size = 5;

function Processor () {

}


/*
	set the number of processUnits
*/
Processor.prototype.size = function (size1) {
	size = size1 || size;
	return size;
};


Processor.prototype.accept = function (filename, done) {

	setTimeout(function () {

		var intervalID = null;
		var acquire = function () {
			
			if (pool.length < size) {
				pool.push(new ProcessUnit());
			}
			var unit = pool.find(function (u) {
				return (!u.isRunning());
			});

			// The 4 conditions have the following meanings:
			// (!unit && !intervalID) indicates: unit is unavailable and setInterval hasn't started.
			//		in that case, start setInterval
			// (!unit && intervalID) indicates: unit is unavailable and setInterval has started.
			// 		in that case, nothing to do except wait for next calling for acquire.
			// (unit && !intervalID) indicates: unit is available and setInterval hasn't started.
			// 		in that case, unit is available the first time, the best.
			// (unit && intervalID) indicates: unit is avaiable and setInterval has started. 
			//		in that case, close setInterval.
			if (!unit && !intervalID) {
				intervalID = setInterval(acquire, 10 * 1000);
			}
			else if (unit && intervalID) {
				clearInterval(intervalID);
			}

			return unit;
		}
		var processunit = acquire();
		processunit.process(filename, function (err, table) {
			done(err, table);
		});

	}, 10);

};



