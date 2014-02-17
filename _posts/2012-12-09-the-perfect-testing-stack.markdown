---
layout: post
title: "The Perfect Testing Stack"
date: 2012-12-09 21:55
comments: true
categories:
 - Ruby
 - Rails
 - Testing
---

**Testing is important**. Your test suite should be just as elegant and thought
through as your application code. Over the past year, I've landed on what I think
is the perfect combination of gems for testing Rails/Ruby applications.

Here's what my `Gemfile` usually looks like when I'm starting out:

```ruby
group :development, :test do
  gem 'rspec-rails', '~> 2.12.0'

  # Auto testing
  gem 'guard-rspec'
  gem 'guard-spork'
  gem 'ruby_gntp'
  gem 'rb-fsevent', '~> 0.9.1'

  # JavaScript
  gem 'konacha'
  gem 'chai-jquery-rails'
  gem 'sinon-chai-rails'
  gem 'sinon-rails'
  gem 'ejs'
end

group :test do
  gem 'capybara'
  gem 'poltergeist'
  gem 'webmock'
  gem 'factory_girl_rails'
  gem 'shoulda-matchers'
  gem 'faker'
  gem 'database_cleaner'
end
```

## Unit Testing

I always start with testing models heavily. This layer, after all, is
essentially the internal API to your application, and ignoring low level tests
here could result in difficult to debug edge cases further down the road. All
my tests are written using [RSpec](https://github.com/rspec/rspec), which is a no brainer. I'll then combine this with
[Shoulda Matchers](https://github.com/thoughtbot/shoulda-matchers) (for testing validations, associations), [Factory Girl](https://github.com/thoughtbot/factory_girl)
(for generating records to test against) and [Faker](http://faker.rubyforge.org/) (for quickly generating fake
content in factories).

For mocks and stubs, I use the built in mocking framework that ships with
RSpec. I've yet to run into any situations where I need more from a mocking
framework, so this works well.

## Acceptance Testing

For high level integration tests, I use [Capybara](https://github.com/jnicklas/capybara), another no brainer. I've
recently started using the [Poltergeist](https://github.com/jonleighton/poltergeist) driver for running specs that need
JavaScript, which has been a huge improvement over capybara-webkit, since it's
far less buggy and has no dependencies other than PhantomJS, which is very
easy to install.

## JavaScript Testing

For unit testing JavaScript, I recently switched from Jasmine to [Konacha](https://github.com/jfirebaugh/konacha)
+ [Mocha](http://visionmedia.github.com/mocha/). Getting jasmine to play nice in a CI environment with Rails 3 and
the asset pipeline is like pulling teeth. With Konacha, it just works.

Combine this with [Chai](http://chaijs.com/) and [Sinon](http://sinonjs.org/) and you've got a very solid solution
for BDD'ing JavaScript. Konacha also allows you to use Capybara drivers to test
the JavaScript specs in a CI environment, which works great with Poltergeist.

## Tying it Together

Running tests isn't much use if they're slow. Doing TDD/BDD can be a huge boost in
productivity, but only if your tests are fast and are only being run when
they're needed. To make tests run as quickly as possible, I use [Guard](https://github.com/guard/guard) +
[Spork](https://github.com/sporkrb/spork). Guard will run the applicable spec for a file whenever it's changed,
and Spork preloads the rails environment at boot. If I'm working on a model, I
can get near instant test results after saving the file by using this setup.

## Conclusion

The above has worked incredibly well for me over the past year, and is what I
used to build the test suite for [24pullrequests.com](https://github.com/andrew/24pullrequests). Hopefully this will help
you in making the right decisions on what to use with your stack!
