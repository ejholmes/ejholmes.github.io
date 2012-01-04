task :start do
  system "foreman start"
end

namespace :jekyll do

  desc 'Delete generated _site files'
  task :clean do
    system "rm -rf _site"
  end

end

namespace :sass do

  desc 'Run the sass watch script'
  task :watch do
    system "sass --watch _sass"
  end

end
