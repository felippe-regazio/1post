const fs = require('fs');
const path = require('path');
const args = process.argv.slice(2);
const cwd = process.cwd();

try {
  require(`${cwd}/blog-config.json`);
} catch {
  console.log('\nWarning: Not a blog\n')
  console.log('Ops... 1Post configuration file not found.');
  console.log('You are on a 1Post project folder? If not, run "1post start" to create a new blog on this folder\n');

  process.exit(0);
}

// -------------------------------------- initial checking

const postFileName = (args[0] || '')
  .normalize('NFD')
  .replace(/ /g, '-')
  .replace(/[\u0300-\u036f]/g, '');
  
const postsDir = path.resolve(cwd, 'posts');
const postTargetDir = path.resolve(cwd, `${postsDir}/${postFileName}`);

if (!postFileName) {
  console.error('FAILED: You must provide a post filename/slug');
  process.exit(1);
}

if (!fs.existsSync(postsDir)){
  fs.mkdirSync(postsDir);
}

if (fs.existsSync(postTargetDir)){
  console.error(`FAILED: A blog post entry named "${postFileName}" already exists`);
  process.exit(1);
}

// -------------------------------------- saving new post.html file

fs.mkdirSync(postTargetDir);

fs.writeFileSync(`${postTargetDir}/post.html`, `<!--:::{
  "post_title": "Post title",
  "post_description": "Post description",
  "post_created_at": "${new Date()}"
}:::-->

<p>
  Your post content goes here, you dont need to create a post title element since it 
  will be automatically added. You can interpolate any data from the post metadata 
  notation or from your blog-config.json file using {{key}} notation.
</p>
`);

// -------------------------------------- done/build

require('./build');