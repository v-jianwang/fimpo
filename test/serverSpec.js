var expect = require('chai').expect;

var Server = require('../lib/server');


describe('server test', function () {

	it('server\'s runing', function () {
	
		var server = new Server();	
		server.init();
		expect(server._config).to.have.ownProperty('sourcePaths');
		server.start();

		server.stop();
	});

});