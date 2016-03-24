var mysql = require('mysql');



exports = module.exports  = DbHelper;

function DbHelper(options) {
	this.options = options;
}


DbHelper.prototype.bulk = function (data, done) {
	var connection = mysql.createConnection(this.options);
	connection.connect();

	var sql = 'insert into customers() values ?';
	var query = connection.query(sql, [data], function (err, result) {
		if (err) {
			console.error(err);
			return;
		}
		done(result);
	});
	connection.end();
}


DbHelper.prototype.selectAll = function (done) {
	var connection = mysql.createConnection(this.options);
	connection.connect();

	var sql = 'select * from customers';
	var query = connection.query(sql, function (err, rows) {
		if (err) {
			console.error(err);
			return;
		}
		done(rows);
	});
	connection.end();
}


DbHelper.prototype.selectCount = function (done) {
	var connection = mysql.createConnection(this.options);
	connection.connect();

	var sql = 'select count(1) as cnt from customers';
	var query = connection.query(sql, function (err, rows) {
		if (err) {
			console.error(err);
			return;
		}
		done(rows);
	});
	connection.end();
}


DbHelper.prototype.clean = function (done) {
	var connection = mysql.createConnection(this.options);
	connection.connect();

	var sql = 'truncate table customers';
	var query = connection.query(sql, function (err, result) {
		if (err) {
			console.error(err);
			return;
		}
		done(result);
	});
	connection.end();
}
