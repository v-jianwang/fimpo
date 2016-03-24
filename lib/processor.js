var ProcessUnit = require('./processUnit');
var DbHelper = require('./dbHelper');

exports = module.exports = Processor;


function Processor (queueSet, config) {
	this.pool = [];
	this.poolSize = config.processSize || 3;

	var dbOptions = {
		"host": config.dbsetting.host,
		"user": config.dbsetting.user,
		"password":  config.dbsetting.password,
		"database": config.dbsetting.database
	};

	var txtParams = {
		"filename": '',
		"rowdelimiter": config.txtsetting.rowdelimiter,
		"coldelimiter": config.txtsetting.coldelimiter
	};

	var self = this;
	queueSet.on(queueSet.EVENT_NEW_REACHED, function (filename) {

		function load(data) {
			var db = new DbHelper(dbOptions);
			db.bulk(data, ()=>{});
		}
		txtParams['filename'] = filename;
		self.accept(txtParams, load);
	});	
}


/*
	set the number of processUnits
*/
Processor.prototype.poolSize = function (size1) {
	this.poolSize = size1 || this.poolSize;
	return poolSize;
};


Processor.prototype.accept = function (options, load) {
	var pool = this.pool;
	var poolSize = this.poolSize;

	setTimeout(function () {

		var intervalID = null;
		var acquire = function () {
			
			var unit = null;
			if (pool.length < poolSize) {
				unit = new ProcessUnit();
				pool.push(unit);
			}
			unit = unit || pool.find(function (u) {
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
		var processUnit = acquire();
		processUnit.process(options, function (err, data) {
			if (err) {
				console.error(err);
				return;
			}
			load(data);
		});

	}, 10);

};



