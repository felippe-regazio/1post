console.log(`
1POST is a CLI to create and manage very simple static generated blogs via NPX.
For more information: https://github.com/felippe-regazio/1post

Usage:
  npx 1post {command}|{postname}

Commands:
  help: show this help
  start: start a new 1post blog on the current folder
  build: updates the blog index page feed with newer posts
  serve: serves the blog using http-serve (npx http-serve)

Blogging:
  To create a new post, just type npx 1post {postname}
`);