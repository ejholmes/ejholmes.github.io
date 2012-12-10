---
layout: post
title: Metaforce - A Ruby gem for interacting with the SFDC Metadata API
date: 2012-01-27 15:15:36 -0800
---

I'd like to introduce you to a little pet project I've been working on in my
spare time; [Metaforce](https://github.com/ejholmes/metaforce). Metaforce is a
Ruby gem that abstracts the [Salesforce Metadata API](http://www.salesforce.com/us/developer/docs/api_meta/index.htm),
which is a Soap based API for CRUD'ing metadata on Salesforce organizations.

Why, you ask? Mainly because I don't like Ant or the Migration tool. I'd much
rather use Rake for migrations than bother with Java based tools. And hey, it's
fun. Not only that, but because it's a gem, other developers can build awesome
tools on top of it, whether that's in Rails, Sinatra, or whatever you please,
without having to delve into the nitty gritty of the Soap API.

You can get started with Metaforce by installing it:

```bash
gem install metaforce --pre
```

Once installed, using it is as simple as configuring your credentials:

```ruby
Metaforce.configure do |config|
  config.username = "me@test.com"
  config.password = "mypassword"
  config.security_token = "mysecuritytoken"
  config.test = true # if you're on a sandbox org
end

client = Metaforce::Metadata::Client.new
```

And then performing the task you want to do. For example, if you want to list
all metadata types on your organization, you can call `.describe`.

```ruby
client.describe
```

And it will return a hash with the results.

Or if you want to list the members of a particular metadata type, you can call
`.list`.

```ruby
client.list :type => "ApexClass"
```

You can even deploy code to an organization:

```ruby
deployment = client.deploy File.dirname(__FILE__)
puts deployment.result :wait_until_done => true
```

Metaforce is currently under active development and there's a lot of features I'd
like to add. You should only use it for testing right now.

For more information, [check out the project on GitHub](https://github.com/ejholmes/metaforce),
and don't be afraid to browse through the [specs](https://github.com/ejholmes/metaforce/tree/develop/spec)
for example usage.
