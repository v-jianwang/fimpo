var expect = require('chai').expect;
var Watcher = require('../lib/watcher');

var fs = require('fs');
var path = require('path');

describe('watcher test', function () {

	var directory = path.join(__dirname, 'tmp', 'watch');
	
	before(function () {
		var helper = require('./testHelper');
		helper.renewDirectory(directory);
	});


	it('create and remove a watcher', function () {
		var watcher = new Watcher();
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

		var mock = {
			put: function (name) {
				expect(name).to.equal(pathname);	
				watcher.unwatch(directory);
				done();				
			}
		}
		var watcher = new Watcher(mock);

		watcher.watch(directory, true);
		fs.writeFileSync(pathname, 'Hello bar');
	});
});