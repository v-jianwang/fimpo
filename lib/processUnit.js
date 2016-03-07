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
function ProcessUnit (filepath) {
	this._filepath = filepath || '';
	this._state = PROCESS_STATE_NEW;
}


/*
	return the state of the ProcessUnit instance
*/
ProcessUnit.prototype.state = function () {
	return this._state;
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
ProcessUnit.prototype.process = function (filepath, done) {
	function plainToArray (data) {
		var rows = data.trim().split(ROW_DELIMITER);
		for (var i = 0; i < rows.length; i++) {
			rows[i] = rows[i].split(COLUMN_DELIMITER);
			rows[i].forEach(function (value, index, array) {
				array[index] = tool.detect(value).shouldBe();
			});
		}
		return rows;
	}

	setTimeout(function () {
		this._state = PROCESS_STATE_RUNNING;

		var data = fs.readFileSync(filepath, 'utf8');
		var table = plainToArray(data, ROW_DELIMITER, COLUMN_DELIMITER);
		this._state = PROCESS_STATE_END;

		done(null, table);
	}, 5);


};


