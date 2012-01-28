---
layout: post
title: How to Install rbenv on OS X
tags:
    - rbenv
    - ruby
    - OS X
---

[rbenv](https://github.com/sstephenson/rbenv) is a tool for managing
ruby versions. It's similar to [RVM](http://beginrescueend.com/) but doesn't require
configuration files. Instead of using gemsets, the user is expected to make
use of [bundler](http://gembundler.com/) to manage gem dependencies.

Installation
------------

Install rbenv from GitHub:

{% highlight bash %}
$ git clone git://github.com/sstephenson/rbenv.git ~/.rbenv
{% endhighlight %}

Add the following lines to your `~/.zshrc` or `~/.bash_profile`.

{% highlight bash %}
export PATH="$HOME/.rbenv/bin:$PATH"
eval "$(rbenv init -)"
{% endhighlight %}

Restart your terminal then install [ruby-build](https://github.com/sstephenson/ruby-build):

{% highlight bash %}
$ cd
$ git clone git://github.com/sstephenson/ruby-build.git
$ cd ruby-build
$ [sudo] ./install.sh
{% endhighlight %}

Install the latest version of Ruby (`1.9.3-p0`) and activate it:

{% highlight bash %}
$ rbenv install 1.9.3-p0
$ rbenv global 1.9.3-p0
$ rbenv rehash
{% endhighlight %}

Restart the terminal again, then update RubyGems:

{% highlight bash %}
$ gem update --system
{% endhighlight %}

rbenv makes use of shims for all binaries, including gems. When you install a
new gem, you need to run `rbenv rehash` to generate the shims. This can be done
automatically by installing the `rbenv-rehash` gem:

{% highlight bash %}
$ gem install rbenv-rehash
{% endhighlight %}

Last but not least, you'll probably want to install bundler:

{% highlight bash %}
$ gem install bundler
{% endhighlight %}

rbenv can make use of gemsets by installing the [rbenv-gemset](https://github.com/jamis/rbenv-gemset)
plugin, however, the preferred method is to use bundler to manage gem dependencies. If
you use [oh my zsh](https://github.com/robbyrussell/oh-my-zsh), you can
activate the bundler plugin, which allows you to run gem executables without
prefixing them with `bundle exec`.

Just add the following to your `~/.zshrc`:

{% highlight bash %}
plugins=(bundler)
{% endhighlight %}

And, just in case you want a system wide installation on a linux server, here's
the code to set that up on Ubuntu 10.04, courtesy of [@benwoodward](https://gist.github.com/benwoodward).

<script src="https://gist.github.com/1521316.js?file=rbenv-install-system-wide.sh"></script>
