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

    if (stdmsg.includes('post.html') || stdmsg.includes('template-')) {
      spawn('1post', [ 'build' ])
        .on('close', function(){
          setTimeout(function() {
            writeFileSync(blogIndex, readFileSync(blogIndex, 'utf-8'));
          }, 500);
        });
    }
  })