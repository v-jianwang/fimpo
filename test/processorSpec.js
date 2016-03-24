var expect = require('chai').expect;
var path = require('path');

var QueueSet = require('../lib/queueSet');
var Config = require('../lib/config');
var Processor = require('../lib/processor');
var testHelper = require('./testHelper');



describe('processor test', function () {
	
	var directory = path.join(__dirname, 'tmp', 'processor');

	before(function () {
		testHelper.prepareDirectory(directory);
	});


	it('processor accept filename', function (done) {
		var filepath = path.join(directory, 'data_processorTest.txt');
		testHelper.createDataFile(filepath);

		function load (data) {
			expect(data.length).to.equal(4);

			expect(data[0][0]).to.be.a('string')
			expect(data[0][0]).to.equal('0001');
			
			expect(data[0][2]).to.be.a('boolean');
			expect(data[0][2]).to.be.true;
			
			expect(data[1][1]).to.equal('Kingston Lee');
			
			expect(data[2][3]).to.be.a('number');
			expect(data[2][3]).to.equal(25);
			expect(data[2][3]).to.be.a('number');
			expect(data[3][3]).to.equal(0.5);

			expect(data[3][4]).to.equal('Officer');

			done();			
		}
		var options = {
			"filename": filepath,
			"rowdelimiter": '',
			"coldelimiter": ''
		};

		var processor = new Processor(new QueueSet(), new Config());
		processor.accept(options, load);
	});
});