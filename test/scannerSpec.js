var expect = require('chai').expect;
var scanner = require('../lib/scanner');

var fs = require('fs');
var path = require('path');

describe('scanner test', function () {
	var directory = path.join(__dirname, 'tmp', 'scan');

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


	beforeEach(function () {
		scanner.removeAllListeners();
		scanner.stop();
	});


	it('create a scanner', function (done) {
		expect(scanner.count()).to.equal(0);
		scanner.on(scanner.EVENT_SCAN_FINISH, function () {
			done();
		});
		scanner.scan(directory, false);
		expect(scanner.count()).to.equal(1);
	});


	it('call function when scanning finishes', function (done) {
		var go = false;
		scanner.on('finished', function (dir, filenames) {
			expect(dir).to.equal(directory);
			expect(scanner.count()).to.equal(0);

			done();
		});

		scanner.scan(directory);
	});


	it('files are searched out when scanning finishes', function (done) {
		// prepare files in directory
		var filea = path.join(directory,'a.txt');
		var fileb = path.join(directory,'b.txt');
		var filec = path.join(directory,'c.txt');
		var expectednames = [ filea, fileb, filec ];

		fs.writeFileSync(filea, 'aaa');
		fs.writeFileSync(fileb, 'bbb');
		fs.writeFileSync(filec, 'ccc');

		scanner.on(scanner.EVENT_SCAN_FINISH, function (dir, filenames) {
			expect(dir).to.equal(directory);
			expect(filenames).to.be.a('Array');
			expect(filenames.length).to.equal(expectednames.length);

			expectednames.sort();
			filenames.sort();

			expect(filenames[0]).to.equal(expectednames[0]);
			expect(filenames[1]).to.equal(expectednames[1]);
			expect(filenames[2]).to.equal(expectednames[2]);

			done();
		});

		scanner.scan(directory, false);
	});
});