var expect = require('chai').expect;

var Server = require('../lib/server');

var Config = require('../lib/config');
var config = new Config();


describe('server test', function () {



	it('server\'s runing', function () {
	
		var server = new Server(config);	
		server.init();
		// expect something here

		server.start();

		// expect something here
		server.stop();
	});

});