console.log(`
1POST is a CLI to create and manage a very simple static generated blogs via NPX
For more information: https://github.com/felippe-regazio/1post

Usage:
  npx 1post {command}|{postslug}

Commands:
  help: show this help
  start: start a new blog on the current folder
  build: updates the blog index page feed with newer posts
  serve: serves the blog locally under the localhost:8080 address

Blogging:
  To create a new post, just run "npx 1post {postslug}"
`);
