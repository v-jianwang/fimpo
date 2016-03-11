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


helper.createDataFile = function (filepath) {
	var os = require('os');
	function writeLine (line) {
		fs.appendFileSync(filepath, line + os.EOL, 'utf8');
	}
	writeLine('0001|Jiang Wang|True|35|Engineer');
	writeLine('0002|Kingston Lee|True|30|Chef');
	writeLine('0003|Lucy Wu|False|25|Teacher');
	writeLine('0004|Lisa Chen|False|0.5|Officer');
}