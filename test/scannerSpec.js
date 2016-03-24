var expect = require('chai').expect;
var Scanner = require('../lib/scanner');

var fs = require('fs');
var path = require('path');

describe('scanner test', function () {
	var directory = path.join(__dirname, 'tmp', 'scan');
	var subdirectory = path.join(__dirname, 'tmp', 'scan', 'sub');

	before(function () {
		var helper = require('./testHelper');
		helper.renewDirectory(directory);
		helper.renewDirectory(subdirectory);	
	});


	it('call function when scanning finishes', function (done) {

		var mock = {
			put : function (filenames) {
				expect(filenames).to.be.a('array');
				expect(filenames.length).to.equal(0);
				done();
			}
		}		
		var scanner = new Scanner(mock, null);
		scanner.scan(directory);
	});


	it('files are searched out when scanning finishes', function (done) {
		// prepare files in directory
		var filea = path.join(directory,'a.txt');
		var fileb = path.join(directory,'b.txt');
		var filec = path.join(subdirectory,'c.txt');
		var expectednames = [ filea, fileb, filec ];

		fs.writeFileSync(filea, 'aaa');
		fs.writeFileSync(fileb, 'bbb');
		fs.writeFileSync(filec, 'ccc');

		var mock = {
			put : function (filenames) {
				expect(filenames.length).to.equal(expectednames.length);

				expectednames.sort();
				filenames.sort();

				expect(filenames[0]).to.equal(expectednames[0]);
				expect(filenames[1]).to.equal(expectednames[1]);
				expect(filenames[2]).to.equal(expectednames[2]);

				done();
			}
		}		
		var scanner = new Scanner(mock, null);
		scanner.scan(directory, true);
	});
});