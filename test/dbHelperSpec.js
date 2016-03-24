var expect = require('chai').expect;
var DbHelper = require('../lib/dbHelper');

describe('dbhelper test', function () {

	var dbOptions = {
		"host": 'localhost',
		"user": 'jiang',
		"password": 'pass@word1',
		"database": 'fimpo'
	};

	beforeEach(function (done) {
		var db = new DbHelper(dbOptions);
		db.clean(function () {
			done();
		});
	});
	

	it('bulk load and retrieve', function (done) {
		var db = new DbHelper(dbOptions);
		var data = [
			['0001', 'Jiang Wang', 1, 35, 'Engineer'],
			['0002', 'Kingston Lee', 1, 30, 'Chef'],
			['0003', 'Lucy Wu', 0, 25, 'Teacher'],
			['0004', 'Lisa Chen', 0, 27, 'Officer'],
			['0005', 'Jiang Wang', 1, 35, 'Engineer'],
			['0006', 'Kingston Lee', 1, 30, 'Chef'],
			['0007', 'Lucy Wu', 0, 25, 'Teacher'],
			['0008', 'Lisa Chen', 0, 27, 'Officer'],		
			['0009', 'Jiang Wang', 1, 35, 'Engineer'],
			['0010', 'Kingston Lee', 1, 30, 'Chef'],
			['0011', 'Lucy Wu', 0, 25, 'Teacher'],
			['0012', 'Lisa Chen', 0, 27, 'Officer'],
			['0013', 'Jiang Wang', 1, 35, 'Engineer'],
			['0014', 'Kingston Lee', 1, 30, 'Chef'],
			['0015', 'Lucy Wu', 0, 25, 'Teacher'],
			['0016', 'Lisa Chen', 0, 27, 'Officer'],													
		];
		var count = data.length;

		db.bulk(data, function (result) {
			expect(result.affectedRows).to.equal(count);

			db.selectAll(function (rows) {
				expect(rows.length).to.equal(count);
				expect(rows[0].fullname).to.equal('Jiang Wang');
				expect(rows[2].gender).to.equal(0);
				expect(rows[7].age).to.equal(27);
				expect(rows[13].occupation).to.equal('Chef');

				done();
			});
		});
	});


	it('bulk load and clean', function (done) {
		var db = new DbHelper(dbOptions);

		var data = [
			['0007', 'Lucy Wu', 0, 25, 'Teacher'],
			['0008', 'Lisa Chen', 0, 27, 'Officer'],		
			['0009', 'Jiang Wang', 1, 35, 'Engineer'],
			['0010', 'Kingston Lee', 1, 30, 'Chef'],
			['0011', 'Lucy Wu', 0, 25, 'Teacher'],
			['0012', 'Lisa Chen', 0, 27, 'Officer'],
			['0013', 'Jiang Wang', 1, 35, 'Engineer'],										
		];
		var count = data.length;

		function check(rows) {
			expect(rows.length).to.equal(0);
			done();
		}

		db.bulk(data, function (result) {
			expect(result.affectedRows).to.equal(count);
			db.clean(function (result) {
				db.selectAll(check);
			});
		});
	});

})