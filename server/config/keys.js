const devKeys = require('./dev');
const prodKeys = require('./prod');

const isProdEnv = () => process.env.NODE_ENV === 'production';

module.exports = isProdEnv() ? prodKeys : devKeys;
