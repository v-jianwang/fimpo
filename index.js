var waiter = require('./lib/waiter');
var fs = require('fs');

var pathname = 'g:\\javascript\\fimpo\\go.txt';
if (fs.existsSync(pathname)) {
	fs.unlinkSync(pathname);
}

waiter.wait('g:\\javascript\\fimpo', false);
waiter.on('reached', function (filename) {
	console.log('I found file:' + filename);
});

setTimeout(() => {
	//fs.writeFileSync(pathname, 'Hello bar');
}, 3*1000);

setTimeout(() => {
	console.log('over');
	waiter.unwait();
}, 10*1000);