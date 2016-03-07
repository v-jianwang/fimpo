
exports = module.exports = tool = {};

const typeString = 'string';
const typeNumber = 'number';
const typeBoolean = 'boolean';

tool.detect = function (value) {
	value = value.trim();
	var type = typeString;

	if (!value) type = typeString;
	else if (regex.isNumber(value)) type = typeNumber;
	else if (regex.isBoolean(value)) type = typeBoolean;
	return new typeDetected(value, type);
};


var regex = {};

regex.isNumber = function (value) {
	return !isNaN(value) && /^([1-9]|0\.|\.)/.test(value);
};

regex.isBoolean = function (value) {
	return /^(true|false)$/i.test(value);
};


function typeDetected (value, typeName) {
	this._value = value;
	this._typeName = typeName;

	this.shouldBe = function () {
		if (this._typeName == typeNumber) return (new Number(value)).valueOf();
		if (this._typeName == typeBoolean) return (new Boolean(value)).valueOf();
		return this._value;
	}
}