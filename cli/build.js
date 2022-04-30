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
      
      addPostEntry(feed, entry, title, createdAt);
    });

  return feed;
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

function addPostEntry(feed = [], entry, title, createdAt) {
  feed.push(`
    <li style="list-style: none"> 
      <article>
        <a href="posts/${entry}">
          <strong>§ ${title}</strong>
        </a>

        <p>${createdAt.toLocaleString(tinyBlogConfig.locale || 'pt-BR')}</p>
      </article>
    </li>
  `)
}

function generateIndex(postsFeed, replacements) {
  const indexTemplate = fs.readFileSync(path.resolve(`${cwd}`, 'template-index.html'), 'utf-8');
  let index = indexTemplate.replace('{{posts_feed}}', postsFeed.join('\n'));

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
console.log('Done. New blog index generated');