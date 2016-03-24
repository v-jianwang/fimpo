var expect = require('chai').expect;
var path = require('path');
var fs = require('fs');

var Server = require('../lib/server');
var Config = require('../lib/config');
var config = new Config();

var DbHelper = require('../lib/dbHelper');


describe('server test', function () {

	var directory = config.sourcePaths[0];
	var dataDirectory = path.join(__dirname, 'tmp', 'data');
	var filename = 'customers.txt';
	var row = 0;

	var dbOptions = {
		"host": config.dbsetting.host,
		"user": config.dbsetting.user,
		"password":  config.dbsetting.password,
		"database": config.dbsetting.database
	};

	var db = new DbHelper(dbOptions);		

	before(function (done) {
		var helper = require('./testHelper');
		helper.renewDirectory(directory);
		helper.renewDirectory(dataDirectory);
		row = helper.createBigDataFile(path.join(dataDirectory, filename));
		
		db.clean(function (result) {
			done();
		});	
	});


	it('server\'s runing', function (done) {
	
		var server = new Server(config);
		
		server.start(500, function () {
			server.stop();
			console.log('server is stopped.');

			db.selectCount(function (rows) {
				expect(rows[0].cnt).to.equal(row);
				done();
			});
		});

		// mv data file to source directory
		fs.createReadStream(path.join(dataDirectory, filename))
			.pipe(fs.createWriteStream(path.join(directory, filename)));
	});

});