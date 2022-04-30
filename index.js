const args = process.argv.slice(2);
const commands = [ 'help', 'start', 'build' ];

commands.includes(args[0]) ?
  require(`./cli/${args[0]}.js`) :
  require('./cli/post.js');