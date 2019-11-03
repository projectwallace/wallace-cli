<div align="center">
  <h1>Wallace CLI</h1>
  <p>Pretty CSS analytics on the CLI.</p>
</div>

[![NPM Version](https://img.shields.io/npm/v/wallace-cli.svg)](https://www.npmjs.com/package/wallace-cli)
[![Build Status](https://travis-ci.com/bartveneman/wallace-cli.svg?branch=master)](https://travis-ci.com/bartveneman/wallace-cli)
[![Known Vulnerabilities](https://snyk.io/test/github/bartveneman/wallace-cli/badge.svg?targetFile=package.json)](https://snyk.io/test/github/bartveneman/wallace-cli?targetFile=package.json)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
![Dependencies Status](https://img.shields.io/david/bartveneman/wallace-cli.svg)
![Dependencies Status](https://img.shields.io/david/dev/bartveneman/wallace-cli.svg)
[![Project: Wallace](https://img.shields.io/badge/Project-Wallace-29c87d.svg)](https://www.projectwallace.com/oss)

## Install

```sh
npm install -g wallace-cli
# or
yarn global add wallace-cli
```

## Usage

```sh
Usage
  $ wallace https://projectwallace.com

  Options
  --format, -f Format pretty (default) or JSON
  --verbose, -v Show verbose analytics output

  Examples
  $ wallace https://projectwallace.com
  $ wallace 'body { color: red; }'
  $ echo 'html { font-size: 16px; } | wallace
  $ wallace 'html {}' --format=json
  $ cat style.css | wallace --verbose
  $ curl http://localhost/css/style.css | wallace
```

## Example output

![Example output for projectwallace.com](example.png)

## Related projects

- [Extract CSS](https://github.com/bartveneman/extract-css) - Extract all CSS
  from a given url, both server side and client side rendered.
- [CSS Analyzer](https://github.com/projectwallace/css-analyzer) - The analyzer
  that powers this module
- [Constyble](https://github.com/bartveneman/constyble) - A CSS complexity
  linter, based on css-analyzer. Don't let your CSS grow beyond the thresholds
  that you provide.
