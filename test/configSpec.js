var expect = require('chai').expect;

describe('config test', function () {
	
	it('create config base on variable', function () {
		var Config = require('../lib/config');
		
		var envDev = 'dev';
		var configDev = new Config(envDev);
		expect(configDev.env).to.equal(envDev);

		var envTest = 'test';
		var configTest = new Config(envTest);
		expect(configTest.env).to.equal(envTest);

		var config = new Config();
		expect(config.env).to.equal('default');
	});
});