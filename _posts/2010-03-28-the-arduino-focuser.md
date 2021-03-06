---
layout: post
title: The Arduino Focuser
comments: true
---

**UPDATE:** The Ardunio Focuser was just featured in the October issue of Astronomy Now magazine in the UK. Read about it on page 76-77!

<a href="http://arduino.cc"><img class="right" src="http://d8y1gp0el652a.cloudfront.net/posts/2010-03-28-the-arduino-focuser/arduino.jpg" alt="Arduino" /></a>

In case you’ve never heard of it, the “Arduino is a tool for the design and development of embedded computer systems, consisting of a simple open hardware design for a single-board microcontroller, with embedded I/O support and a standard programming language.” In other words, it kicks ass.

This is where I decided to start my homemade ASCOM compliant computerized focuser. My goal was to use the Arduino to control a single stepper motor that in turn would be controlled by auto focusing software such as MaximDL or FocusMax using an ASCOM driver.

This is where I decided to start my homemade <a href="http://ascom-standards.org/">ASCOM</a> compliant computerized focuser. My goal was to use the Arduino to control a single stepper motor that in turn would be controlled by auto focusing software such as MaximDL or FocusMax using an ASCOM driver.

## The Hardware

<a href="http://www.websequencediagrams.com/?lz=cGFydGljaXBhbnQgIkNvbXB1dGVyIiBhcyBob3N0CgASDUFyZHVpbm8AGQVhAAYGABIPZGFmcnVpdCBNb3RvciBTaGllbGQASAVzAAYFAEEOU3RlcHBlcgAnBgBuBW1vdG9yAGYOVGVsZXNjb3BlIEZvY3VzAIEVB2YABgYKCm5vdGUgb3ZlcgA1BwBzB2lzIGEgZ2VhcmVkIHMAYQYKAFgGIGZyb20gYW4gT3Jpb24gRVEtM00gCiBkcml2ZQplbmQgbm90ZQoKAIFYBy0tPgCBNAY6IAoAgT0GLS0-AIF0BzogAG4RLACBEAgAfQpjb25uZWN0ZWQgdmlhCiBhIHNoYWZ0IGNvdXBsZQCBCAYKAIB_EACAfw4gCgpob3N0AG0LVVNCIEMAUgZpb24gKFZpcnR1YWwgQ09NIHBvcnQpAIEkCD4AgkwFOiBEQjkgU2VyaWFsIENhYmxlIChwd3IsIGduZCwgKzQgcGlucyk&amp;s=napkin"><img src="http://www.websequencediagrams.com/cgi-bin/cdraw?lz=cGFydGljaXBhbnQgIkNvbXB1dGVyIiBhcyBob3N0CgASDUFyZHVpbm8AGQVhAAYGABIPZGFmcnVpdCBNb3RvciBTaGllbGQASAVzAAYFAEEOU3RlcHBlcgAnBgBuBW1vdG9yAGYOVGVsZXNjb3BlIEZvY3VzAIEVB2YABgYKCm5vdGUgb3ZlcgA1BwBzB2lzIGEgZ2VhcmVkIHMAYQYKAFgGIGZyb20gYW4gT3Jpb24gRVEtM00gCiBkcml2ZQplbmQgbm90ZQoKAIFYBy0tPgCBNAY6IAoAgT0GLS0-AIF0BzogAG4RLACBEAgAfQpjb25uZWN0ZWQgdmlhCiBhIHNoYWZ0IGNvdXBsZQCBCAYKAIB_EACAfw4gCgpob3N0AG0LVVNCIEMAUgZpb24gKFZpcnR1YWwgQ09NIHBvcnQpAIEkCD4AgkwFOiBEQjkgU2VyaWFsIENhYmxlIChwd3IsIGduZCwgKzQgcGlucyk&amp;s=napkin"></a>

The stepper motor I’m using is an old stepper I had from a single axis drive system for and EQ3 mount, which is a high resolution (geared) stepper motor. In order to control the stepper motor, I came across a <a href="http://www.ladyada.net/make/mshield/">motor shield</a> by Adafruit Industries. It also included a <a href="http://www.ladyada.net/make/mshield/use.html">library</a> for microstepping, which made it ideal for high precision focus control. The stepper motor is connected to the Arduino board via the motor shield through an RS232 cable.

## The Software

The software can be found at <a href="https://github.com/ejholmes/Arduino-Focuser">https://github.com/ejholmes/Arduino-Focuser</a>. The code is licensed under the GPL V2, so feel free to use it freely, but please mention my initial project!

## The Final Product

It supports absolute positioning of the focuser up to around 13,000 points (on my focuser) of focus.

<div class="flash"><object width="410" height="252"><param name="movie" value="http://www.youtube.com/v/buo05pGONkw&hl=en_US&fs=1&"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="http://www.youtube.com/v/buo05pGONkw&hl=en_US&fs=1&" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="410" height="252"></embed></object></div>
