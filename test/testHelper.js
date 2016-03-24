var fs = require('fs');
var path = require('path');

var helper = exports = module.exports = {};


helper.prepareDirectory = function (directory) {
	if (!fs.existsSync(directory)) {
		fs.mkdirSync(directory);
	}
	else {
		fs.readdirSync(directory).forEach(function (file) {
			fs.unlinkSync(path.join(directory, file));
		});
	}
};


helper.renewDirectory = function (directory) {
	var tool = require('../lib/tool');
	tool.rmdirRec(directory); // remove directory in order to remove files inside
	tool.mkdirRec(directory); // create directory which is empty
};


helper.createDataFile = function (filepath) {
	var os = require('os');
	function writeLine (line) {
		fs.appendFileSync(filepath, line + os.EOL, 'utf8');
	}
	writeLine('0001|Jiang Wang|True|35|Engineer');
	writeLine('0002|Kingston Lee|True|30|Chef');
	writeLine('0003|Lucy Wu|False|25|Teacher');
	writeLine('0004|Lisa Chen|False|0.5|Officer');
};


helper.createBigDataFile = function (filepath) {
	var os = require('os');
	function write (content, encoding) {
		fs.appendFileSync(filepath, content, encoding);
	}
	function format (num, bits) {
		var numBits = num.toString().split('');
		var numLength = numBits.length;
		if (numLength >= bits) {
			return num.toString();
		}
		for (var i=0; i < bits - numLength; i++) {
			numBits.unshift('0');
		}
		return numBits.join('');
	}

	var customer1 = ['0001', 'Jiang Wang', 'True', '35', 'Engineer'];
	var customer2 = ['0002', 'Kingston Lee', 'True', '30', 'Chef'];
	var customer3 = ['0003', 'Lucy Wu', 'False', '25', 'Teacher'];
	var customer4 = ['0004', 'Lisa Chen', 'False', '28', 'Officer'];

	var row = 0;
	for (var i=0; i < 1000; i++, row+=4) {
		customer1[0] = format(row+1, 6);
		customer2[0] = format(row+2, 6);
		customer3[0] = format(row+3, 6);
		customer4[0] = format(row+4, 6);

		var content = ''.concat(customer1.join(',')).concat(os.EOL)
						.concat(customer2.join(',')).concat(os.EOL)
						.concat(customer3.join(',')).concat(os.EOL)
						.concat(customer4.join(',')).concat(os.EOL);

		write(content, 'utf8');
	}

	return row;
}