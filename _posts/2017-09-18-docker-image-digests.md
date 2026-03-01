---
layout: post
title: Docker image digests
---

> This post was originally published on the [Remind Engineering Blog](https://engineering.remind.com/docker-image-digests/).

When you download something from the internet, a common method for determining both integrity and authenticity of an object is to generate a cryptographic hash of it, and compare it to what you expect. For example:

```bash
$ curl -LO https://downloads.raspberrypi.org/raspbian_lite/images/raspbian_lite-2017-08-17/2017-08-16-raspbian-stretch-lite.zip
$ echo "52e68130c152895905abe66279dd9feaa68091ba55619f5b900f2ebed381427b 2017-08-16-raspbian-stretch-lite.zip" | shasum -a 256 -c
```

`52e68130c152895905abe66279dd9feaa68091ba55619f5b900f2ebed381427b` is the content addressable identifier for the `2017-08-16-raspbian-stretch-lite` version of Raspbian. I verified both it's integrity, and authenticity by checking the sha256 hash of what I downloaded, with what I know to be the expected hash.

How confident are you that your infrastructure is running the Docker images that you expect to be running? If you deploy Docker images by tag, for example `:latest`, you shouldn't be. It's the equivalent of performing the download above, without ever checking the sha256 hash of what we downloaded.

## A Tabletop Exercise

Let's say you're using Docker Hub to store images, and you're also deploying Docker images to your infrastructure by specifying a tag, like `acme/app:v1.2.11`.

Now, one day, you discover that someone's Docker Hub credentials on your team have been exposed. Docker Hub doesn't support MFA, so you know an attacker could have had push access to your repositories.

How can you be sure that the `acme/app:v1.2.11` you're running, hasn't been overwritten with a malicious version? Short answer is you can't, because you're not verifying what you're downloading from the internet.

Has this ever happened to us? No, but it's a scary thought.

## Digests

The answer to this in the Docker world are *digests* (there's also Content Trust, but I won't get into that in this post).

> Images that use the v2 or later format have a content-addressable identifier called a digest. As long as the input used to generate the image is unchanged, the digest value is predictable.

*From [https://docs.docker.com/engine/reference/commandline/images/#list-the-full-length-image-ids](https://docs.docker.com/engine/reference/commandline/images/#list-the-full-length-image-ids)*

Instead of specifying `acme/app:v1.2.11`, we should have been specifying the content addressable identifier for that tag; `acme/app@sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

When we use the digest as the identifier, Docker will not only pull the image with that digest, but also calculate the sha256 digest of what we downloaded, and verify it against what we specified.

This provides a number of protections:

* It removes any attack vector through the Docker Registry to change what we're running in production. An attack that overwrites a mutable tag, has no effect on what we're running.
* It prevents any possibility of a MiTM attack, since any alteration (either malicious, or accidental) will be checked.
* It increases the overall stability of the system as a whole, by the simple fact that the digest is an immutable identifier, so we know it can never change.
* It improves cacheability for `docker pull`'s; content addressable identifiers can never change, so they can be cached efficiently.

## An Observation

The underlying attack vector and mitigation described above isn't specific to Docker images. You can apply the same concept to just about any package manager/distributor (think [RubyGems](http://blog.rubygems.org/2016/04/06/gem-replacement-vulnerability-and-mitigation.html), [PyPi](http://www.nbu.gov.sk/skcsirt-sa-20170909-pypi/), [NPM](http://blog.npmjs.org/post/77758351673/no-more-npm-publish-f)).

Can we do something better as an industry to build content addressability into dependency management? This is one of the reasons why I'm excited about distributed content addressable filesystems like [IPFS](https://ipfs.io/). If *everything* you depend on is specified by content, then the only attack vector is by using a dependency that you consciously ignored to review.

## Conclusion

Never deploy tags to production, always use the content addressable identifier. Mutability is the devil of security and stability.
