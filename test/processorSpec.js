var expect = require('chai').expect;
var path = require('path');

var processor = require('../lib/processor');
var testHelper = require('./testHelper');



describe('processor test', function () {
	
	var directory = path.join(__dirname, 'tmp', 'processor');

	before(function () {
		testHelper.prepareDirectory(directory);
	});


	it('processor accept filename', function (done) {
		var filepath = path.join(directory, 'data_processorTest.txt');
		testHelper.createDataFile(filepath);

		processor.accept(filepath, function (err, table) {
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

			done();
		});
	});
});