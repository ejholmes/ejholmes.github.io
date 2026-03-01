# ejholmes.io

My personal blog, built with Jekyll and hosted on GitHub Pages.

## Development

This project uses [devbox](https://www.jetify.com/devbox) to manage dependencies.

### Setup

```bash
# Install devbox if you haven't already
curl -fsSL https://get.jetify.com/devbox | bash

# Enter the devbox shell
devbox shell

# Install Ruby dependencies
bundle install
```

### Running locally

```bash
devbox run serve
```

This starts a local server at http://localhost:4000 with live reload.

### Adding a new post

Create a new file in `_posts/` with the format `YYYY-MM-DD-title.md`:

```markdown
---
layout: post
title: Your Post Title
---

Your content here...
```

### Adding images

Place images in `assets/images/post-name/` and reference them in your post:

```markdown
![Alt text](/assets/images/post-name/image.png)
```
