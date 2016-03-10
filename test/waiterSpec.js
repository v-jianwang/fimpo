var expect = require('chai').expect;
var waiter = require('../lib/waiter');

var fs = require('fs');
var path = require('path');

describe('waiter test', function () {

	var directory = path.join(__dirname, 'tmp', 'wait');

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

	afterEach(function () {
		waiter.unwait();
	});


	it('create and remove a waiter', function () {
		waiter.wait(directory, false);
		expect(waiter.count()).to.equal(1);
		
		waiter.unwait(directory);
		expect(waiter.count()).to.equal(0);
	});


	it('call function when a file reaches', function (done) {
		var filename = 'bar.txt';
		var pathname = path.join(directory, filename);
		if (fs.existsSync(pathname)) {
			fs.unlinkSync(pathname);
		}

		waiter.on('reached', function (filename) {
			expect(filename).to.equal(path.basename(pathname));
			done();
		});

		waiter.wait(path.dirname(pathname), false);
		fs.writeFileSync(pathname, 'Hello bar');
	});
});