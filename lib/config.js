var path = require('path');


exports = module.exports = Config;


const CONFIG_PATH = '../config';

function Config (env) {
	env = env || 'default';
	
	return require(path.join(CONFIG_PATH, env));
}