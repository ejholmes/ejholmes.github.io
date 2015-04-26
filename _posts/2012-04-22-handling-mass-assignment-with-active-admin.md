---
layout: post
title: Handling mass assignment with Active Admin
comments: true
---

With the recent [Github security vulnerability](https://github.com/blog/1068-public-key-security-vulnerability-and-mitigation), a lot of people have been paying closer attention to security in their Rails applications, mainly when dealing with [mass assignment](http://guides.rubyonrails.org/security.html#mass-assignment).

However, locking down mass assignment can be very inconvenient when dealing with admin interfaces where you need to allow certain users to mass assign attributes that a regular user shouldn't be able to do. Fortunately, there's an easy way to get past this by using Rails 3.1's [scoped mass assignment](http://launchware.com/articles/whats-new-in-edge-scoped-mass-assignment-in-rails-3-1)

## Scoped Mass Assignment

Scoped mass assignment allows you to assign a set of attributes to a certain 'scope' that you can then specify when calling `create` or `update_attributes`.  Essentially, it allows you to do something like this:

```ruby
# app/models/post.rb
class Post < ActiveRecord::Base
  attr_accessible :title, :content
  attr_accessible :title, :content, :published, as: :admin
end

# app/controllers/posts_controller.rb
def create
  # If the current user is an admin, this will allow the `published` attribute
  # to be mass assigned.
  if current_user.admin?
    @post = Post.new(params[:post], as: :admin)
  else
    @post = Post.new(params[:post])
  end
  @post.save
  respond_with @post
end
```

The above code will only allow the `published` attribute to be mass assigned if the current user is an admin.

## Scoped Mass Assignment with Active Admin

Scoped mass assignment works fine when we're writing the controllers ourselves, but how do we assign a scope when using active admin, where controllers are automatically created for us? Well, fortunately, active admin makes use of [inherited_resources](https://github.com/josevalim/inherited_resources), which provides a class method called `with_role`.

By appending a few lines of code to our active admin initializer, we can assign the admin scope to all model calls while under the admin interface:

```ruby
# config/initializers/active_admin.rb
module ActiveAdmin
  class BaseController
    with_role :admin
  end
end
```

Now, whenever a post is created or updated by a user using the admin interface, the `:admin` scope will be used, which will allow the `published` attribute to be mass assigned.

If we had a `role` field on our AdminUser model we could even take this a step further by overriding the `role_given?` and `as_role` methods:

```ruby
# config/initializers/active_admin.rb
module ActiveAdmin
  class BaseController
    def role_given?
      current_admin_user.role
    end

    def as_role
      { as: current_admin_user.role.downcase.to_sym }
    end
  end
end
```

Now, we can easily set the security for these roles in our model:

```ruby
# config/initializers/post.rb
class Post < ActiveRecord::Base
  attr_accessible :title, :content, as: :editor
  attr_accessible :published, as: :publisher
end
```

## Related Resources

* [Railscasts: #237 Dynamic attr_accessible](http://railscasts.com/episodes/237-dynamic-attr-accessible)
* [Rails 3.1 scoped mass assignment](http://launchware.com/articles/whats-new-in-edge-scoped-mass-assignment-in-rails-3-1)
