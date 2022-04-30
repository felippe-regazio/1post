const fs = require('fs');
const path = require('path');
const postsDir = path.resolve(__dirname, '../posts');

///* this file is automatically generated. dont edit it directly */
//var __posts__ = [{}];
// (?s)<h1>.+</h1>

const postsPathList = fs.readdirSync(postsDir, { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name)
  .forEach(entry => {
    const postContent = fs.readFileSync(`${postsDir}/${entry}/index.html`, 'utf-8');

    console.log(postContent.match(/<h1>(.*?)<\/h1>/g));
  });