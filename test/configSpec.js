var expect = require('chai').expect;

describe('config test', function () {
	
	it('create config base on variable', function () {
		var config = require('../lib/config');
		
		var envDev = 'dev';
		var configDev = config(envDev);
		expect(configDev.env).to.equal(envDev);

		var envTest = 'test';
		var configTest = config(envTest);
		expect(configTest.env).to.equal(envTest);

		config = config();
		expect(config.env).to.equal('default');
	});
});