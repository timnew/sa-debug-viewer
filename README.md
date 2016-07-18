Sensors Analytics  [![NPM version][npm-image]][npm-url] [![Build Status][ci-image]][ci-url] [![Dependency Status][depstat-image]][depstat-url]
==============================

> This is a command-line debug viwer for [Sensors Analytics] .

## Install

Install using [npm][npm-url].

    $ npm install -g sa-debug-viewer

## Usage

```
sa-debug [options] <host>

Options:
  --project, -p  Project to monitor                                     [string]
  --event, -e    Event filter                                            [array]
  --userId, -u   User id                                                 [array]
  --help         Show help                                             [boolean]
```

e.g.

Fetch all `click` event from `default` project from  debug viewer of `http://my-project.cloud.sensorsdata.cn`

```
$ sa-debug -e click -p default http://my-project.cloud.sensorsdata.cn
```

## License
MIT

[![NPM downloads][npm-downloads]][npm-url]

[homepage]: https://github.com/timnew/sa-debug-viewer

[npm-url]: https://npmjs.org/package/sa-debug-viewer
[npm-image]: http://img.shields.io/npm/v/sa-debug-viewer.svg?style=flat
[npm-downloads]: http://img.shields.io/npm/dm/sa-debug-viewer.svg?style=flat

[ci-url]: https://travis-ci.org/timnew/sa-debug-viewer/
[ci-image]: https://img.shields.io/travis/timnew/sa-debug-viewer.svg?style=flat

[depstat-url]: https://gemnasium.com/timnew/sa-debug-viewer
[depstat-image]: http://img.shields.io/gemnasium/timnew/sa-debug-viewer.svg?style=flat

[Sensors Analytics]: http://sensorsdata.cn/
