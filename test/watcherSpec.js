var expect = require('chai').expect;
var watcher = require('../lib/watcher');

var fs = require('fs');
var path = require('path');

describe('watcher test', function () {

	var directory = path.join(__dirname, 'tmp', 'watch');

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
		watcher.unwatch();
	});


	it('create and remove a watcher', function () {
		watcher.watch(directory, false);
		expect(watcher.count()).to.equal(1);
		
		watcher.unwatch(directory);
		expect(watcher.count()).to.equal(0);
	});


	it('call function when a file reaches', function (done) {
		var filename = 'bar.txt';
		var pathname = path.join(directory, filename);
		if (fs.existsSync(pathname)) {
			fs.unlinkSync(pathname);
		}

		watcher.on('reached', function (filename) {
			expect(filename).to.equal(path.basename(pathname));
			done();
		});

		watcher.watch(path.dirname(pathname), false);
		fs.writeFileSync(pathname, 'Hello bar');
	});
});