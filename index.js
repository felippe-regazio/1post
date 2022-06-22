#! /usr/bin/env node

const args = process.argv.slice(2);
const commands = [ 'help', 'start', 'build', 'serve' ];

if (!args[0]) {
  require('./cli/help.js');
  process.exit(0);
}

if (args[0] !== 'help' && args[0] !== 'start') {
  try {
    require(`${process.cwd()}/blog-config.json`);
  } catch {
    console.log('\nWarning: Not a blog\n')
    console.log('Ops... 1Post configuration file not found.');
    console.log('You are on a 1post project folder? If not, run "1post start" to create a new blog on this folder\n');
  
    process.exit(0);
  }
}

commands.includes(args[0]) ?
  require(`./cli/${args[0]}.js`) :
  require('./cli/post.js');