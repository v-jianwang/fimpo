var expect = require('chai').expect;
var fs = require('fs');
var path = require('path');

var ProcessUnit = require('../lib/processUnit');


describe('processUnit test', function () {

	var directory = path.join(__dirname, 'tmp', 'process');

	before(function () {
		if (!fs.existsSync(directory)) {
			fs.mkdirSync(directory);
		}
		else {
			fs.readdirSync(directory).forEach(function (file) {
				fs.unlinkSync(path.join(directory, file));
			});
		}
	});
	

	it('create a processUnit', function() {
		var unit = new ProcessUnit();
		expect(unit.state()).to.equal('new');
	});


	it('processUnit read the data lines of a file', function (done) {
		var filepath = path.join(directory, 'data.txt');
		var os = require('os');
		function writeLine (line) {
			fs.appendFileSync(filepath, line + os.EOL, 'utf8');
		}
		writeLine('0001|Jiang Wang|True|35|Engineer');
		writeLine('0002|Kingston Lee|True|30|Chef');
		writeLine('0003|Lucy Wu|False|25|Teacher');
		writeLine('0004|Lisa Chen|False|0.5|Officer');

		var unit = new ProcessUnit();
		unit.process(filepath, function (err, table) {
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