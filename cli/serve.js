const path = require('path');
const { spawn } = require('child_process');
const { writeFileSync, readFileSync } = require('fs');
const blogIndex = path.resolve(process.cwd(), 'index.html');

console.log('\nStarting the HTTP Server...');

spawn('npx', [ 'live-server', process.cwd() ])
  .stdout.on('data', function(data) {
    const stdmsg = data.toString();

    if (!stdmsg.includes('Change detected')) {
      console.log(stdmsg);
    }

    if (/post.[html|md]/gm.test(stdmsg) || stdmsg.includes('template-')) {
      require('./build');
      delete require.cache[require.resolve('./build')];
      writeFileSync(blogIndex, readFileSync(blogIndex, 'utf-8'));
    }
  });