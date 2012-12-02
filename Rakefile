require 'httparty'
require 'pathname'

task :default => :start

desc 'Start the jekyll server'
task :start do
  system "foreman start"
end

desc 'Delete generated _site files'
task :clean do
  system "rm -rf _site"
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
