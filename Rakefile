require 'bundler'
Bundler.require :default, :assets
require 'fileutils'
require 'pathname'

desc 'Compile assets and jekyll templates'
task :compile => ['jekyll:compile', 'assets:precompile']

task 'jekyll:compile' do
  Jekyll::Site.new(Jekyll.configuration({})).process
end

namespace :assets do
  TARGET = './assets'

  Catapult.environment.clear_paths
  %w[javascripts stylesheets images fonts].each do |path|
    Catapult.environment.append_path(Pathname("./_assets/#{path}"))
  end
  Catapult.environment.append_path("#{Gem::Specification.find_by_name('bourbon').gem_dir}/app/assets/stylesheets")

  def catapult_cli(task)
    cli = Catapult::CLI.new
    cli.invoke task, [], target: TARGET
  end

  desc 'Compile javascripts and stylesheets'
  task :precompile do
    catapult_cli :build
  end

  desc 'Watch files for changes and compile them'
  task :watch do
    catapult_cli :watch
  end
end

desc 'Delete generated _site files'
task :clean do
  FileUtils.rm_rf Pathname('./_site')
end

desc 'Update resume content'
task 'resume:update' do
  LOCATION = 'https://raw.github.com/gist/3156426/resume.md'
  FILE = Pathname('./resume.md')

  content = <<-CONTENT
---
layout: default
---

CONTENT
  content << HTTParty.get(LOCATION)
  File.open(FILE, 'w') do |file|
    file.puts content
  end
end

desc 'Create a new post'
task :new do
  TARGET_DIR = '_posts'

  title = ENV["title"] || "New Title"
  slug = title.gsub(' ', '-').downcase

  filename = "#{Time.new.strftime('%Y-%m-%d')}-#{slug}.md"
  path = File.join(TARGET_DIR, filename);
  post = <<-CONTENT
---
layout: post
title: #{title}
date: #{Time.new.to_s}
---

CONTENT
  File.open(path, 'w') do |file|
    file.puts post
  end
  puts "new post generated in #{path}"
  system "vim #{path}"
end
