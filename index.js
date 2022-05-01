#! /usr/bin/env node

const args = process.argv.slice(2);
const commands = [ 'help', 'start', 'build', 'serve' ];

if (!args[0]) {
  require('./cli/help.js');
  process.exit(0);
}

commands.includes(args[0]) ?
  require(`./cli/${args[0]}.js`) :
  require('./cli/post.js');