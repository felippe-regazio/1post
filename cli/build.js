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

if (fs.existsSync(`${postsDir}/cache.json`) && !process.argv.includes('--force')) {
  try {
    const cached = require(`${postsDir}/cache.json`);
    Object.assign(cache, cached);
  } catch {
    console.warn('WARN: Could not retrieve posts,json, skipping cache.');
    fs.unlinkSync(`${postsDir}/cache.json`);
  }
}

// -------------------------------------- utils

function hashContent(content) {
  return crypto.createHash('md5').update(content).digest('hex');
}

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

function formatDate(dateStr, locale) {
  return new Date(dateStr).toLocaleString(locale);
}

function getContentTemplateConfig(entry, contentTemplate) {
  try {
    const metaConfigComment = getMetaConfigStr(contentTemplate);
    const metaConfigObject = metaConfigStrToObj(metaConfigComment);

    return {
      ...metaConfigObject,
      entryName: entry,
      hash: hashContent(contentTemplate),
      post_url: `${blogConfig.blog_url}/posts/${entry}`,
      post_created_at_formated: formatDate(metaConfigObject.post_created_at, blogConfig.blog_locale || 'en')
    }
  } catch(error) {
    console.error(`FATAL (!): Could not parse the meta information (<!--::: :::-->) for post: \n${entry}`);
    console.error(error);
    process.exit(1);
  }
}

function bindPostTemplateAndContent(postTemplate, contentTemplate) {
  const metaConfigString = getMetaConfigStr(contentTemplate);
  contentTemplate = contentTemplate.replace(metaConfigString, '');
  
  return postTemplate.replace('{{post}}', contentTemplate);
}

function sortFeedNewerFirst(feed) {
  return feed.sort((a, b) => {
    const dateA = new Date(a.info.post_created_at);
    const dateB = new Date(b.info.post_created_at);

    if (dateA < dateB) return 1;
    if (dateA > dateB) return -1;

    return 0;
  });
}

// -------------------------------------- bulding posts

fs.readdirSync(postsDir, { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name)
  .forEach(entry => {
    const contentTemplate = fs.readFileSync(`${postsDir}/${entry}/post.html`, 'utf-8');
    const contentTemplateConfig = getContentTemplateConfig(entry, contentTemplate);

    if (!cache[entry] || cache[entry].hash !== contentTemplateConfig.hash) {
      const postMetaConfig = { ...blogConfig, ...contentTemplateConfig };
      const postTemplate = fs.readFileSync(postTemplateFilePath, 'utf-8');
      let postContent = bindPostTemplateAndContent(postTemplate, contentTemplate);
  
      for(key in postMetaConfig) {
        postContent = postContent.replace(new RegExp(`{{${key}}}`, 'g'), postMetaConfig[key]);
      }
  
      posts.push(postMetaConfig);
      cache[entry] = contentTemplateConfig;

      postContent = '<!-- This is an automatically generated file, do not edit it directly -->\n' + postContent;
      fs.writeFileSync(`${postsDir}/${entry}/index.html`, postContent);
      console.log(`* Created: "/posts/${entry}"`);
    } else {
      posts.push({ ...blogConfig, ...cache[entry] });
    }
  });

// -------------------------------------- saves the cache

fs.writeFileSync(`${postsDir}/cache.json`, JSON.stringify(cache));

// -------------------------------------- bulding index page

const postsFeed = sortFeedNewerFirst(posts.map(entry => {
  return {
    info: entry,
    html: `
      <li style="list-style: none"> 
        <article>
          <a href="posts/${entry.entryName}">
            <p class="pm-h6 pm-no-margin"><strong>§ ${entry.post_title}</strong></p>
          </a>
          
          <p>${entry.post_description}</p>
          <p class="pm-no-margin pm-text-right pm-disabled">${entry.post_created_at_formated}</p>
        </article>
      </li>
    `
  }
}));

const indexTemplateContent = fs.readFileSync(indexTemplateFilePath, 'utf-8');
const postsFeedHtml = `<ul>${postsFeed.map(item => item.html).join('\n')}</ul>`;
const noPostsHint = `<p>${blogConfig.blog_no_posts_hint}</p>`;

let index = indexTemplateContent.replace('{{posts_feed}}', postsFeedHtml || noPostsHint);

for(key in blogConfig) {
  index = index.replace(new RegExp(`{{${key}}}`, 'g'), blogConfig[key]);
}

index = '<!-- This is an automatically generated file, do not edit it directly -->\n' + index;

// -------------------------------------- done

fs.writeFileSync(path.resolve(`${cwd}`, 'index.html'), index);
console.log('\nBlog building done');