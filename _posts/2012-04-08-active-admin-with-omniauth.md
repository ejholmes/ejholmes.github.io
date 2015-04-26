---
layout: post
title: Salesforce OAuth2 authentication with Active Admin
comments: true
---

Here's a quick and dirty guide to get OAuth2 authentication working for Active Admin using the Salesforce strategy.

## Instructions

Add the omniauth gem to your Gemfile and run `bundle install`.

```ruby
# Gemfile

gem 'omniauth-salesforce'
```

Configure devise to use the Salesforce strategy for omniauth.

```ruby
# config/initializers/devise.rb

require 'omniauth-salesforce'
config.omniauth :salesforce, ENV["SFDC_CLIENT_ID"], ENV["SFDC_CLIENT_SECRET"]
```

Add `:omniauthable` to the `devise` call in the `AdminUser` model and add a class method for retrieving the admin user based on the oauth access token.

```ruby
# app/models/admin_user.rb

class AdminUser < ActiveRecord::Base
  devise :database_authenticatable, :omniauthable,
         :recoverable, :rememberable, :trackable, :validatable
  
  def self.find_for_salesforce_oauth(access_token, signed_in_resource=nil)
    data = access_token.extra
    if admin_user = AdminUser.where(:email => data.email).first
      admin_user
    else
      AdminUser.create!(:email => data.email, :password => Devise.friendly_token[0, 20])
    end
  end
end
```

Add an omniauth controller to the `devise_for` call in the routes file.

```ruby
# config/routes.rb

devise_config = ActiveAdmin::Devise.config
devise_config[:controllers][:omniauth_callbacks] = 'admin_users/omniauth_callbacks'
devise_for :admin_users, devise_config
```

Add a controller to handle the omniauth callback.

```ruby
# app/controllers/admin_users/omniauth_callbacks_controller.rb

class AdminUsers::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def salesforce
    @admin_user = AdminUser.find_for_salesforce_oauth(auth_hash, current_admin_user)

    if @admin_user.persisted?
      flash[:notice] = I18n.t "devise.omniauth_callbacks.success", :kind => "Salesforce"
      sign_in_and_redirect @admin_user, :event => :authentication
    else
      session['devise.salesforce_data'] = auth_hash
      redirect_to new_admin_user_registration_url
    end
  end

  def auth_hash
    request.env["omniauth.auth"]
  end
end
```

Override the Active Admin login page in your application and add a link to sign in using Salesforce.

```erb
# app/views/active_admin/devise/sessions/new.html.erb

<div id="login">
  <h2><%= title "#{active_admin_application.site_title} Login" %></h2>
  <div class="oauth_providers" style="margin-top: 40px;">
    <%= link_to 'Sign in with Salesforce', admin_user_omniauth_authorize_path(:salesforce) %>
  </div>

  <% scope = Devise::Mapping.find_scope!(resource_name) %>
  <%= active_admin_form_for(resource, :as => resource_name, :url => send(:"#{scope}_session_path"), :html => { :id => "session_new" }) do |f| 
    f.inputs do
      Devise.authentication_keys.each { |key| f.input key, :input_html => {:autofocus => true}}
      f.input :password
      f.input :remember_me, :as => :boolean, :if =>  false  #devise_mapping.rememberable? }
    end
    f.buttons do
      f.commit_button "Login"
    end
  end
  %>

  <%= render :partial => "active_admin/devise/shared/links" %>
</div>
```
