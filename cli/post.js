const fs = require('fs');
const path = require('path');
const args = process.argv.slice(2);
const cwd = process.cwd();

//  getting information

const postFileName = args[0];
const postsDir = path.resolve(cwd, 'posts');
const postTargetDir = path.resolve(cwd, `${postsDir}/${postFileName}`);
const postTemplateFilePath = path.resolve(cwd, 'template-post.html');

if (!fs.existsSync(postsDir)){
  fs.mkdirSync(postsDir);
}

if (!postFileName) {
  console.error('FAILED: You must provide a post filename/slug');
  process.exit(1);
}

if (fs.existsSync(postTargetDir)){
  console.error(`FAILED: A blog post entry named "${postFileName}" already exists`);
  process.exit(1);
}

if (!fs.existsSync(postTemplateFilePath)){
  console.error(`FAILED: File "template-post.html" not found on the current directory.`);
  console.log('Run "npx tinyblog start" to start a TinyBlog project on this directory.');
  process.exit(1);
}

//  generating template

const tinyBlogConfig = require(`${cwd}/tinyblog-config.json`);
let template = fs.readFileSync(postTemplateFilePath, 'utf-8');

const templateTags = {
  '{{date}}': new Date()
};

Object.keys(tinyBlogConfig).forEach(key => {
  templateTags[`{{${key}}}`] = tinyBlogConfig[key];
});

for(tag in templateTags) {
  template = template.replace(new RegExp(tag, 'g'), templateTags[tag]);
}

// saving post

fs.mkdirSync(postTargetDir);
fs.writeFileSync(`${postTargetDir}/index.html`, template);

// done

console.log(`Created new Post: "${postTargetDir}/index.html"`);