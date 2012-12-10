---
layout: post
title: How to Install rbenv on OS X
---

[rbenv](https://github.com/sstephenson/rbenv) is a tool for managing
ruby versions. It's similar to [RVM](http://beginrescueend.com/) but doesn't require
configuration files. Instead of using gemsets, the user is expected to make
use of [bundler](http://gembundler.com/) to manage gem dependencies.

### Installation

Install rbenv from GitHub:

```bash
$ git clone git://github.com/sstephenson/rbenv.git ~/.rbenv
```

Add the following lines to your `~/.zshrc` or `~/.bash_profile`.

```bash
export PATH="$HOME/.rbenv/bin:$PATH"
eval "$(rbenv init -)"
```

Restart your terminal then install [ruby-build](https://github.com/sstephenson/ruby-build):

```bash
$ cd
$ git clone git://github.com/sstephenson/ruby-build.git
$ cd ruby-build
$ [sudo] ./install.sh
```

Install the latest version of Ruby (`1.9.3-p0`) and activate it:

```bash
$ rbenv install 1.9.3-p0
$ rbenv global 1.9.3-p0
$ rbenv rehash
```

Restart the terminal again, then update RubyGems:

```bash
$ gem update --system
```

rbenv makes use of shims for all binaries, including gems. When you install a
new gem, you need to run `rbenv rehash` to generate the shims. This can be done
automatically by installing the `rbenv-rehash` gem:

```bash
$ gem install rbenv-rehash
```

Last but not least, you'll probably want to install bundler:

```bash
$ gem install bundler
```

rbenv can make use of gemsets by installing the [rbenv-gemset](https://github.com/jamis/rbenv-gemset)
plugin, however, the preferred method is to use bundler to manage gem dependencies. If
you use [oh my zsh](https://github.com/robbyrussell/oh-my-zsh), you can
activate the bundler plugin, which allows you to run gem executables without
prefixing them with `bundle exec`.

Just add the following to your `~/.zshrc`:

```bash
plugins=(bundler)
```

And, just in case you want a system wide installation on a linux server, here's
the code to set that up on Ubuntu 10.04, courtesy of [@benwoodward](https://gist.github.com/benwoodward).

{% gist 1521316 rbenv-install-system-wide %}
