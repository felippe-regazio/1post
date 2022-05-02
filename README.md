# 1POST

A tiny, fast and fun static site generator for quick blogging. 1POST is written entirely in NodeJS and has no dependencies. You can install as a global package or run directly from NPX.

# Usage

Create a new folder for your blog, and from this folder root run:

```bash
npx 1post start
```

You created a new blog on the current folder, will talk about the created files forward.  
Now just run:

```
npx 1post my-first-post
```

A new post has been created on the folder `/posts`. You can edit the post by editing the file `/posts/my-first-post/post.html`, this file will be automatically processed on every build. Now run:

```
npx 1post build
```

Now the static blog is assembled and ready for deploy. 

# Styling

# Philosofy

1POST is very small and really, i mean really simple. Is indicated if you want to write quick, pretty, fast and powerful HTML+CSS only posts, specially technical posts. All the posts will be on the same level in a unique list on the Home, and identified by Title and Date. 

1POST has no search bar, no tags, no footer, no header, no markdown, no JS frameworks, no JS at all, no complex categorization features, almost nothing; only the good and old HTML+CSS. When i said simple i mean: VERY simple (but powerful) blog. It has a fast CLI to manage Posts and Templates and build the blog, it also automatically configures: Style, Themes, Acessibility and SEO.

1POST is indicated if you want a Content-First fast and quick blog with "as simple as possible" philosofy in mind. For example: we have a single post list on the Home beacause even if you have a 1.000 itens list there, the payload is smaller and faster than a entire JS framework and hundreds of JS code lines to create pagination and search which, for a single purpose of Content-First, its just too much.

If you need more features and  a deeper kind of control and categorization for your blog, there is a plenty of other options out there that can manage your needings as a breeze.


