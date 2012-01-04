---
layout: post
title: Installing Mac OS X Snow Leopard on ASUS P5N-E SLI
tags: [OS X]
---

Specs
-----
* [ASUS P5N-E SLI Motherboard](http://www.newegg.com/Product/Product.aspx?Item=N82E16813131142)
* [Intel Core 2 Quad Q6600](http://www.newegg.com/Product/Product.aspx?Item=N82E16819115017)
* [Western Digital Caviar Blue Hard Drive](http://www.newegg.com/Product/Product.aspx?Item=N82E16822136770)
* NVIDIA GT 240
* [TRENDnet USB Ethernet adapter](http://www.amazon.com/gp/product/B00007IFED)

What you'll need
----------------
* [Snow Leopard](http://store.apple.com/us/product/MC573Z/A)
* [Empire EFI](http://www.mediafire.com/?thd5nmo2oyn)
* IDE DVD Drive (SATA Drive's won't work, it will stall with "Still waiting for root device")

Instructions
------------
1. Burn Empire EFI Legacy (iBoot may also work using this method)
2. Boot Empire EFI
3. Remove Empire EFI from the DVD Drive. Insert Snow Leopard and press F5
4. Press Enter to boot the Snow Leopard Installer
5. Partition and format the hard drive then install Snow Leopard as normal
6. When the installation is complete, remove Snow Leopard and re-insert Empire EFI into the DVD Drive
7. Boot Empire EFI again. Select Snow Leopard and press Enter
8. Follow the [iBoot guide](http://tonymacx86.blogspot.com/2010/04/iboot-multibeast-install-mac-os-x-on.html) to install 10.6.8 combo update
9. During MultiBeast setup, select the following:
   * EasyBeast
   * System Utilities
   * FakeSMC
   * IOUSBFamily Rollback
   * JMicron ATA
   * PCIRootUID=1 Fix
   * GraphicsEnabler=Yes
17. DO NOT REBOOT! Install [AppleNForceATA.kext](http://www.mediafire.com/?ufxx5uq1qaxtrxw) to /Extras/Extensions
18. Run: sudo chown -R root:wheel /Extras/Extensions/*
19. Now run /Applications/Kext Utility.app
20. Reboot and enjoy OS X 10.6.8!

You should now have working ethernet, and dual screen monitor support. I've yet to get my SATA DVD Drive to function.
