const spawn = require('child_process').spawn;

console.log('Starting the HTTP Server...');
cmd = spawn('npx', [ 'live-server', process.cwd() ], { stdio: 'inherit' });