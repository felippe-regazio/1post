const spawn = require('child_process').spawn;
cmd = spawn('npx', ['live-server', process.cwd()]);
cmd.stderr.on('data', data => console.log(data.toString()));

let lock = false;

cmd.stdout.on('data', data => {
  const str = data.toString();
  console.log(data.toString());

  if (!lock && str && str.includes('Change detected')) {
    lock = true;
    require(`${__dirname}/build.js`);
    lock = false;
  }
});