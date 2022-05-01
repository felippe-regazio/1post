const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const cwd = process.cwd();
const postsDir = path.resolve(cwd, 'posts');
const blogConfig = require(`${cwd}/blog-config.json`);
const postTemplateFilePath = path.resolve(cwd, 'template-post.html');
const indexTemplateFilePath = path.resolve(`${cwd}`, 'template-index.html');

const cache = {};
const posts = [];

// -------------------------------------- initial checking

if (!fs.existsSync(postTemplateFilePath)){
  console.error(`FAILED: File "template-post.html" not found on the current directory.`);
  process.exit(1);
}

if (!fs.existsSync(indexTemplateFilePath)){
  console.error(`FAILED: File "template-index.html" not found on the current directory.`);
  process.exit(1);
}

if (!fs.existsSync(postsDir)) {
  fs.mkdirSync(postsDir);
}

if (fs.existsSync(`${postsDir}/posts.json`)) {
  try {
    const postsJson = require(`${postsDir}/posts.json`);
    Object.assign(cache, postsJson);
  } catch {
    console.warn('WARN: Could not retrieve posts,json, skipping cache.');
    fs.unlinkSync(`${postsDir}/posts.json`);
  }
}

// -------------------------------------- utils

function getMetaConfigStr(contentTemplate) {
  return contentTemplate
    .match(/(<!--:::.*?:::-->)|(<!--:::[\S\s]+?:::-->)|(<!--:::[\S\s]*?$)/g)[0];
}

function metaConfigStrToObj(metaConfigComment) {
  const metaConfigString = metaConfigComment
  .replace('<!--:::', '')
  .replace(':::-->', '')
  .replace(/[\r\n]/gm, '');

  return JSON.parse(metaConfigString);
}

function getPostMetaConfig(contentTemplate) {
  try {
    const metaConfigComment = getMetaConfigStr(contentTemplate);
    const metaConfigObject = metaConfigStrToObj(metaConfigComment);

    return { ...blogConfig, ...metaConfigObject };
  } catch {
    console.error(`FATAL: Could not parse the meta information (<!--::: :::-->) for post: \n${postTemplateFilePath}`);
  }
}

function bindPostTemplateAndContent(postTemplate, contentTemplate) {
  const metaConfigString = getMetaConfigStr(contentTemplate);
  contentTemplate = contentTemplate.replace(metaConfigString, '');
  
  return postTemplate.replace('{{post}}', contentTemplate);
}

function sortFeedNewerFirst(feed) {
  return feed.sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);

    if (dateA.post_created_at < dateB.post_created_at) return 1;
    if (dateA.post_created_at > dateB.post_created_at) return -1;

    return 0;
  });
}

// -------------------------------------- bulding posts

fs.readdirSync(postsDir, { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name)
  .forEach(entry => {
    const postTemplate = fs.readFileSync(postTemplateFilePath, 'utf-8');
    const contentTemplate = fs.readFileSync(`${postsDir}/${entry}/post.html`, 'utf-8');
    const postMetaConfig = getPostMetaConfig(contentTemplate);
    let postContent = bindPostTemplateAndContent(postTemplate, contentTemplate);

    for(key in postMetaConfig) {
      postContent = postContent.replace(new RegExp(`{{${key}}}`, 'g'), postMetaConfig[key]);
    }

    posts.push({
      ...postMetaConfig,
      entryName: entry,
      hash: crypto.createHash('md5').update(postContent).digest('hex')  
    });

    fs.writeFileSync(`${postsDir}/${entry}/index.html`, postContent);
  });

// -------------------------------------- bulding index page

const postsFeed = sortFeedNewerFirst(posts.map(entry => {
  return `
    <li style="list-style: none"> 
      <article>
        <a href="posts/${entry.entryName}">
          <strong>§ ${entry.post_title}</strong>
        </a>

        <p>${new Date(entry.post_created_at).toLocaleString(blogConfig.blog_locale || 'en')}</p>
      </article>
    </li>
  `
}));

const indexTemplateContent = fs.readFileSync(indexTemplateFilePath, 'utf-8');
let index = indexTemplateContent.replace('{{posts_feed}}', postsFeed.join('\n') || `<p>${blogConfig.blog_no_posts_hint}</p>`);

for(key in blogConfig) {
  index = index.replace(new RegExp(`{{${key}}}`, 'g'), blogConfig[key]);
}

// -------------------------------------- done

fs.writeFileSync(path.resolve(`${cwd}`, 'index.html'), index);
console.log('A new blog build has been generated. Done');