#! /usr/bin/env node

const args = process.argv.slice(2);
const commands = [ 'help', 'start', 'build', 'serve' ];

commands.includes(args[0]) ?
  require(`./cli/${args[0]}.js`) :
  require('./cli/post.js');