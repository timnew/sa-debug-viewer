'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hookStream = hookStream;
exports.default = createObservable;

var _rx = require('rx');

function hookStream(stream) {
  stream.pause();

  return observer => {
    const onData = observer.onNext.bind(observer);
    const onError = observer.onError.bind(observer);
    const onEnd = observer.onCompleted.bind(observer);

    stream.addListener('data', onData);
    stream.addListener('error', onError);
    stream.addListener('end', onEnd);

    stream.resume();

    return () => {
      stream.removeListener('data', onData);
      stream.removeListener('error', onError);
      stream.removeListener('end', onEnd);
    };
  };
}

function createObservable(stream) {
  return _rx.Observable.create(hookStream(stream)).publish().refCount();
}