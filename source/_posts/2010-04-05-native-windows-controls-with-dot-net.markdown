---
layout: post
title: Native Windows Controls in .NET
tags: [.NET]
---
<img src="http://farm5.static.flickr.com/4067/4492960730_4226e218ab_o.jpg" class="right" />
I came across a very frustrating issue while writing [uTorrent Notifier](http://ejholmes.github.com/uTorrent-Notifier/); the fact that the default context menu/main menu controls look absolutely hideous. They use the Office 2007 look and feel and I think I speak for most people when I say that Office 2007 was not exactly the holy grail of good design. However, the Windows Vista/7 context menu's look very sleek.

So after endless google searches on the subject of integrating native Win32 controls with .NET I came across [this](http://www.codeproject.com/KB/vista/themedvistacontrols.aspx) post. It's actually really quite simple get native looking context menu's/main menu's in .NET, all it requires is using the "Context Menu" control rather than the "Context Menu Strip" control.

In Visual C# Express 2008 you can add this to the toolbox by right clicking on the toolbox and selecting "Customize", then look for the "ContextMenu" control and "MainMenu".
