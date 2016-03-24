var expect = require('chai').expect;
var testHelper = require('./testHelper');
var path = require('path');

var ProcessUnit = require('../lib/processUnit');


describe('processUnit test', function () {

	var directory = path.join(__dirname, 'tmp', 'process');

	before(function () {
		testHelper.prepareDirectory(directory);
	});
	

	it('create a processUnit', function() {
		var unit = new ProcessUnit();
		expect(unit.isNew()).to.be.true;
		expect(unit.isRunning()).to.be.false;
		expect(unit.isEnd()).to.be.false;
	});


	it('processUnit read the data lines of a file', function (done) {
		var filepath = path.join(directory, 'data_processUnitTest.txt');
		testHelper.createDataFile(filepath);

		var unit = new ProcessUnit();

		var options = {
			"filename": filepath,
			"rowdelimiter": '',
			"coldelimiter": ''
		};
		unit.process(options, function (err, table) {
			expect(table.length).to.equal(4);

			expect(table[0][0]).to.be.a('string')
			expect(table[0][0]).to.equal('0001');
			
			expect(table[0][2]).to.be.a('boolean');
			expect(table[0][2]).to.be.true;
			
			expect(table[1][1]).to.equal('Kingston Lee');
			
			expect(table[2][3]).to.be.a('number');
			expect(table[2][3]).to.equal(25);
			expect(table[2][3]).to.be.a('number');
			expect(table[3][3]).to.equal(0.5);

			expect(table[3][4]).to.equal('Officer');

			expect(unit.isEnd()).to.be.true;

			done();
		});

	});
});