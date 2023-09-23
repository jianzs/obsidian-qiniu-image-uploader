# Obisidian Qiniu Image Uploader

This is a plugin for [Obsidian](https://obsidian.md). It was generated based on the [standard plugin template](https://github.com/obsidianmd/obsidian-sample-plugin).

This project implements an image uploader, that uploads the images to [Qiniu Cloud](https://www.qiniu.com/) instead of storing them locally in your vault.

## Installation

Install the plugin via the [Community Plugins](https://help.obsidian.md/Advanced+topics/Third-party+plugins#Discover+and+install+community+plugins) tab within Obsidian

## Getting started

### Qiniu Cloud configuration

You should create a bucket on the Qiniu Cloud, and configure an external link domain name for it. 

To obtain the `AccessKey` and `AccessSecretKey`, you can fetch them from the key management section in your Qiniu personal center.

### Plugin configuration in Obsidian

All setting items are required, except for the the `Name Prefix`.

## Thanks

- [Obsidian Image Auto Upload Plugin](https://github.com/renmu123/obsidian-image-auto-upload-plugin)
- [Obsidian Imgur Plugin](https://github.com/gavvvr/obsidian-imgur-plugin)