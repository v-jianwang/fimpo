const expect = require('chai').expect;
const path = require('path');
const fs = require('fs');

const tool = require('../lib/tool');

describe('tool test', function () {

	var directory = path.join(__dirname, 'tmp', 'tool');


	it('detect the type of literal value and return a value as type detected.', function () {
		var value = tool.detect('fimpo').shouldBe();
		expect(value).to.be.a('string');
		expect(value).to.equal('fimpo');

		value = tool.detect('00017').shouldBe();
		expect(value).to.be.a('string');
		expect(value).to.equal('00017');		

		value = tool.detect('True').shouldBe();
		expect(value).to.be.a('boolean');
		expect(value).to.be.true;

		value = tool.detect('FALSE').shouldBe();
		console.log(value);
		expect(value).to.be.a('boolean');
		expect(value).to.not.be.true;

		value = tool.detect('286').shouldBe();
		expect(value).to.be.a('number');
		expect(value).to.equal(286);

		value = tool.detect('.45').shouldBe();
		expect(value).to.be.a('number');
		expect(value).to.equal(0.45);
	});


	it('make sure the path exists', function () {
		var subdirectory = path.join(directory, 'foo');
		var subsubdirectory = path.join(subdirectory, 'bar');

		if (fs.existsSync(subsubdirectory))
			fs.rmdirSync(subsubdirectory);
		if (fs.existsSync(subdirectory))
			fs.rmdirSync(subdirectory);
		
		var exists = fs.existsSync(subsubdirectory);
		expect(exists).to.be.false;

		tool.mkdirRec(subsubdirectory);
		exists = fs.existsSync(subsubdirectory);
		expect(exists).to.be.true;
	});


	it('remove directory recursively', function () {
		var subdirectory = path.join(directory, 'foo');
		var subsubdirectory = path.join(subdirectory, 'bar');
		var filepath1 = path.join(subsubdirectory, 'text1.txt');
		var filepath2 = path.join(subsubdirectory, 'text2.txt');

		if (!fs.existsSync(subdirectory))
			fs.mkdirSync(subdirectory);

		if (!fs.existsSync(subsubdirectory))
			fs.mkdirSync(subsubdirectory);

		if (!fs.existsSync(filepath1))
			fs.writeFileSync(filepath1, '');
		
		if (!fs.existsSync(filepath2))
			fs.writeFileSync(filepath2, '');		

		tool.rmdirRec(subdirectory);
		var exists = fs.existsSync(filepath1);
		expect(exists).to.be.false;

		exists = fs.existsSync(filepath2);
		expect(exists).to.be.false;

		exists = fs.existsSync(subsubdirectory);

		expect(exists).to.be.false;
		exists = fs.existsSync(subdirectory);
		expect(exists).to.be.false;						
	});
});