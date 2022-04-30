const fs = require('fs');
const path = require('path');
const cwd = process.cwd();
const postsDirectoryPath = path.resolve(cwd, 'posts');
const tinyBlogConfig = require(`${cwd}/tinyblog-config.json`);

if (!fs.existsSync(postsDirectoryPath)) {
  console.error('FAILED: Posts directory not found');
  process.exit(1);
}

// --------------------------------------

function getPostFeed(postsDir) {
  const feed = [];
  
  fs.readdirSync(postsDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .forEach(entry => {
      const postContent = fs.readFileSync(`${postsDir}/${entry}/index.html`, 'utf-8');
      const title = getPostTitle(postContent);
      const createdAt = getPostCreatedAt(postContent);
      
      feed.push(createFeedItem(entry, title, createdAt));
    });

  return sortFeedNewerFirst(feed);
}


function getPostTitle(postContent) {
  const titleH1Str = postContent.match(/<h1(.*?)<\/h1>/g)[0]
  return titleH1Str ? titleH1Str.replace(/<\/?h1>/g,'').trim() : '';
}

function getPostCreatedAt(postContent) {
  const createdAtComment = postContent.match(/<!--:::(.*?):::-->/g)[0];
  const createdAtStr = createdAtComment && createdAtComment.replace('<!--:::', '').replace(':::-->', '');

  return new Date(createdAtStr);
}

function createFeedItem(entry, title, createdAt) {
  return {
    entry,
    title,
    createdAt,
    html: `
      <li style="list-style: none"> 
        <article>
          <a href="posts/${entry}">
            <strong>§ ${title === 'Post Title' ? unslug(entry) : title}</strong>
          </a>
  
          <p>${createdAt.toLocaleString(tinyBlogConfig.locale || 'pt-BR')}</p>
        </article>
      </li>
    `
  } 
}

function sortFeedNewerFirst(feed) {
  return feed.sort((a, b) => {
    if (a.createdAt < b.createdAt) return 1;
    if (a.createdAt > b.createdAt) return -1;

    return 0;
  });
}

function unslug(str) {
  if (!str || typeof str !== 'string') {
    return str;
  }

  return (str.substring(0, 1).toUpperCase() + str.substring(1)).replace(/-/g, ' ');
}

function generateIndex(postsFeed, replacements) {
  const postsFeedHtml = postsFeed.map(item => item.html).join('\n');
  const indexTemplate = fs.readFileSync(path.resolve(`${cwd}`, 'template-index.html'), 'utf-8');
  let index = indexTemplate.replace('{{posts_feed}}', postsFeedHtml);

  for(key in replacements) {
    index = index.replace(new RegExp(`{{${key}}}`, 'g'), replacements[key]);
  }
  
  index += `\n<!--:::${new Date()}:::-->`;
  return index;
}

// -------------------------------------- logics

const postsFeed = getPostFeed(postsDirectoryPath);
const index = generateIndex(postsFeed, tinyBlogConfig);

fs.writeFileSync(path.resolve(`${cwd}`, 'index.html'), index);
console.log('New blog index page generated');