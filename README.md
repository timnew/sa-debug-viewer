Sensors Analytics  [![NPM version][npm-image]][npm-url] [![Build Status][ci-image]][ci-url] [![Dependency Status][depstat-image]][depstat-url]
==============================

> This is a command-line debug viwer for [Sensors Analytics] .

## Install

Install using [npm][npm-url].

```
$ npm install -g sa-debug-viewer
```

## DebugEventStream

DebugEventStream is a standard readable stream in object mode.
It connects to SensorsData debug viewer and yield parsed message.

```js
import DebugMessageStream from 'sa-debug-viewer'

const messageStream = new DebugMessageStream('http://my-project.cloud.sensorsdata.cn')
messageStream.on('data', (message) => console.log(message))
```

## Message Object

The following object is the message that yield by `DebugMessageStream`

```json
{
  "project": "default",
  "dryRun": true,
  "message": {
    "time": 1469086165353,
    "properties": {      
      "$lib_version": "0.0.13",
      "env": "qa",
      "page": "home-page",
      "$lib": "node",
      "$city": "北京",
      "$province": "北京",
      "$country": "中国"
    },
    "lib": {
      "$lib_version": "0.0.13",
      "$lib": "node",
      "$lib_method": "code"
    },
    "type": "track",
    "distinct_id": "23451896",
    "event": "page_view"
  }
}
```

## Rx Observable

`DebugMessageStream` provides `toObservable` method that converts `DebugMessageStream` into a `Rx.Observable`

For more detail, checkout Microsoft's [Rx documentation]

```js
import DebugMessageStream from 'sa-debug-viewer'

const messageStream = new DebugMessageStream('http://my-project.cloud.sensorsdata.cn')
messageStream.toObservable()
             .filter((message) => message.project === 'production')
             .filter((message) => message.dryRun)
             .map((message) => message.message)
             .subscribe(
               (event) => console.log('Event: ', event),
               (err) => console.error('Error: ', err),
               () => console.log('Completed')
             )
```


## CLI Utility

```
$ sa-debug [options] <host>

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
[RxJS]: https://github.com/Reactive-Extensions/RxJS
[Rx documentation]: https://github.com/Reactive-Extensions/RxJS/tree/master/doc
