---
layout: post
title: Force.com - Using Custom Labels as Global Settings
tags: Force.com
---

One of the biggest annoyances about Force.com development is the lack of customizable global settings/key value store. Recently, I needed a way to store a single value that I could access globally through Visualforce and Apex classes, but I didn't want to rely on writing custom controllers and unecessary code to perform a very simple task that 99% of other languages/frameworks offer.

Fortunately, there is a way to do this (albeit, a little hackish) by using Custom Labels. The great thing about custom labels is that it is very easy to access the value from both Visualforce and Apex, without requiring any custom controllers.

Let's say for example that you want to store a value in the "debug" variable. Maybe you want to output unminified resources on a Sandbox environment, but output minified resources on Production. This can be done rather easily by creating a Custom Label called "debug" and giving it a value of "true" on Sandbox and "false" on Production. Then use some conditional statements to output the proper assets based on the environment that the application is being run under:

{% highlight java %}
<apex:outputText rendered="{!$Label.debug = 'true'}">
    <!-- FULL ASSETS -->
    <script src="{!URLFOR($Resource.Assets, 'javascripts/jquery.tools.min.js')}" type="text/javascript"></script>
    <script src="{!URLFOR($Resource.Assets, 'javascripts/jquery.flexslider-min.js')}" type="text/javascript"></script>
    <script src="{!URLFOR($Resource.Assets, 'javascripts/jquery.paginate.js')}" type="text/javascript"></script>
    <script src="{!URLFOR($Resource.Assets, 'javascripts/application.js')}" type="text/javascript"></script>
</apex:outputText>
<apex:outputText rendered="{!NOT($Label.debug = 'true')}">
    <!-- MINIFIED ASSETS -->
    <script src="{!URLFOR($Resource.Assets, 'application.js')}" type="text/javascript"></script>
</apex:outputText>
{% endhighlight %}
