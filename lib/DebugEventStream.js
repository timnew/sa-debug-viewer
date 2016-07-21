'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stream = require('stream');

var _queries = require('./queries');

var _rx = require('./rx');

var _rx2 = _interopRequireDefault(_rx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

let DebugEventStream = class DebugEventStream extends _stream.Readable {
  constructor(host) {
    let options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    super(Object.assign({}, options, { objectMode: true }));

    if (host == null) throw new Error('Host is not provided');
    this._urls = (0, _queries.buildUrls)(host);

    this._sessionId = options.sessionId;
  }

  get urls() {
    return this._urls;
  }
  get sessionId() {
    return this._sessionId;
  }
  get sessionBound() {
    return this._sessionId != null;
  }

  _read() {
    var _this = this;

    return _asyncToGenerator(function* () {
      try {
        if (!_this.sessionBound) {
          yield _this.createSession();
        }
        yield _this.fetchData();
      } catch (ex) {
        _this.emit('error', ex);
      }
    })();
  }

  createSession() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      _this2._sessionId = yield (0, _queries.createSession)(_this2.urls.registerSession, _this2.sessionId);
    })();
  }

  fetchData() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      const entries = yield (0, _queries.fetchData)(_this3.urls.fetchData, _this3.sessionId);
      entries.forEach(function (entry) {
        return _this3.push(entry);
      });
    })();
  }

  toObservable() {
    return (0, _rx2.default)(this);
  }
};
exports.default = DebugEventStream;