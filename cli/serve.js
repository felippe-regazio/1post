const { exec } = require("child_process");

exec(`npx http-server ${process.cwd()} -o`);