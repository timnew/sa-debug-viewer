'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _rx = require('rx');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const ENTRY_REGEXP = /^\[(\w+)\] dry_run: (true|false), valid message:(.*)/;

let DebugEventStream = class DebugEventStream extends _rx.Subject {
  constructor(host) {
    super();
    console.log(`Connect to ${ host }...`);
    this.registerUrl = `${ host }/accessories/debug_data_session_register`;
    this.fetchUrl = `${ host }/accessories/debug_data_fetch`;
  }

  register() {
    var _arguments = arguments,
        _this = this;

    return _asyncToGenerator(function* () {
      let sessionId = _arguments.length <= 0 || _arguments[0] === undefined ? `${ Date.now() }` : _arguments[0];

      _this.sessionId = sessionId;

      const response = yield (0, _nodeFetch2.default)(_this.registerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ session_id: _this.sessionId })
      });

      if (!response.ok) {
        console.error('Server');
        throw new Error(`Server error: ${ response.status }`);
      }

      const body = yield response.json();

      if (!body.ok) {
        throw new Error(`Response Error: ${ body }`);
      }

      return _this;
    })();
  }

  fetchData() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const response = yield (0, _nodeFetch2.default)(_this2.fetchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ session_id: _this2.sessionId })
      });

      if (!response.ok) {
        _this2.onError(`Error: ${ response.status }`);
        return setImmediate(_this2.fetchData.bind(_this2));
      }

      const serverData = yield response.json();

      if (!serverData.ok) {
        _this2.onError(serverData);
        return setImmediate(_this2.fetchData.bind(_this2));
      }

      serverData.data.forEach(function (entry) {
        return _this2.onNext(_this2.parseEntry(entry));
      });

      return setImmediate(_this2.fetchData.bind(_this2));
    })();
  }

  parseEntry(entry) {
    const matches = ENTRY_REGEXP.exec(entry);
    return {
      project: matches[1],
      dryRun: JSON.parse(matches[2]),
      message: JSON.parse(matches[3])
    };
  }

  start() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      if (_this3.sessionId == null) {
        throw new Error('Session is null');
      }

      _this3.fetchData();

      return _this3;
    })();
  }
};
exports.default = DebugEventStream;