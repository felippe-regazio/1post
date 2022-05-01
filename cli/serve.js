const { exec } = require("child_process");

console.log(`Starting new HTTP Server on localhost:8080...`);
exec(`npx http-server ${process.cwd()} -a localhost -o`);