const fs = require('fs');

const tool = require('../lib/tool');


exports = module.exports = ProcessUnit;

const PROCESS_STATE_NEW = 'new';
const PROCESS_STATE_RUNNING = 'running';
const PROCESS_STATE_END = 'end';

const ROW_DELIMITER = require('os').EOL;
const COLUMN_DELIMITER = '|';
/*
	initialize a ProcessUnit
*/
function ProcessUnit () {
	this._filepath = '';
	this._state = PROCESS_STATE_NEW;
}


/*
	return the state of the ProcessUnit instance
*/
ProcessUnit.prototype.isNew = function () {
	return (this._state == PROCESS_STATE_NEW);
};


/*
	return the state of the ProcessUnit instance
*/
ProcessUnit.prototype.isRunning = function () {
	return (this._state == PROCESS_STATE_RUNNING);
};


/*
	return the state of the ProcessUnit instance
*/
ProcessUnit.prototype.isEnd = function () {
	return (this._state == PROCESS_STATE_END);
};



/*
	return file path the ProcessUnit is processing with
*/
ProcessUnit.prototype.filepath = function () {
	return this._filepath;
};



/*
	read the file and pass file content to callback function
*/
ProcessUnit.prototype.process = function (options, done) {
	this._filepath = options.filename;
	var rowdelimiter = options.rowdelimiter || ROW_DELIMITER;
	var coldelimiter = options.coldelimiter || COLUMN_DELIMITER;
	var self = this;

	function plainToArray (data) {
		var rows = data.trim().split(rowdelimiter);
		for (var i = 0; i < rows.length; i++) {
			rows[i] = rows[i].split(coldelimiter);
			rows[i].forEach(function (value, index, array) {
				array[index] = tool.detect(value).shouldBe();
			});
		}
		return rows;
	}

	setTimeout(function () {
		self._state = PROCESS_STATE_RUNNING;
		
		var data = fs.readFileSync(self._filepath, 'utf8');
		var table = plainToArray(data);

		self._state = PROCESS_STATE_END;

		done(null, table);
	}, 5);

	return self;
};


