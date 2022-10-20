console.log(`
1POST is a CLI to create and manage a very simple static generated blogs via NPX
For more information: https://github.com/felippe-regazio/1post

Usage:
  npx 1post {command}|{postslug}

Commands:
  help: show this help
  start: start a new blog on the current folder
  build: builds the blog. adding --force will skip cache
  serve: serves the blog locally with live server

Blogging:
  To create a new post, just run "npx 1post {postslug}"
  You can use --md option to write using markdown
`);
