const fs = require('fs');
const path = require('path');

exports = module.exports = tool = {};

const TYPE_STRING = 'string';
const TYPE_NUMBER = 'number';
const TYPE_BOOLEAN_TRUE = 'boolean_true';
const TYPE_BOOLEAN_FLASE = 'boolean_false';


/*
	detect the type of literal value and return the value in detected type
*/
tool.detect = function (value) {
	value = value.trim();
	var type = TYPE_STRING;

	if (!value) type = TYPE_STRING;
	else if (regex.isNumber(value)) type = TYPE_NUMBER;
	else if (regex.isBooleanTrue(value)) type = TYPE_BOOLEAN_TRUE;
	else if (regex.isBooleanFalse(value)) type = TYPE_BOOLEAN_FLASE;
	return {
		shouldBe: function () {
			if (type == TYPE_NUMBER) return (new Number(value)).valueOf();
			if (type == TYPE_BOOLEAN_TRUE) return (new Boolean(value)).valueOf(); 
			if (type == TYPE_BOOLEAN_FLASE) return (new Boolean()).valueOf();
			return value;
		}
	};
};


var regex = {};

regex.isNumber = function (value) {
	return !isNaN(value) && /^([1-9]|0\.|\.)/.test(value);
};

regex.isBooleanTrue = function (value) {
	return /^true$/i.test(value);
};

regex.isBooleanFalse = function (value) {
	return /^false$/i.test(value);
};


/*
	remove directory recursively as command 'rm -rf' does
*/
tool.rmdirRec = function (directory) {
	var rmdir = function (dir) {
		if (!fs.existsSync(dir)) {
			return;
		}

		fs.readdirSync(dir).forEach(function (element) {
			var child = path.join(dir, element);
			var stats = fs.statSync(child);
			if (stats.isDirectory())
				rmdir(child);
			else 
				rm(child);
		});
		fs.rmdirSync(dir);
	};

	var rm = function (filepath) {
		fs.unlinkSync(filepath);
	};

	rmdir(directory);
};


/*
	make directory recursively. make parent folder first if it doesn't exist.
*/
tool.mkdirRec = function (directory) {
	var mkdir = function (dir) {
		var parent = path.dirname(dir);
		if (!fs.existsSync(parent))
			mkdir(parent);

		if (!fs.existsSync(dir))
			fs.mkdirSync(dir);
	};

	mkdir(directory);
};
