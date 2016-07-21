'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchData = exports.createSession = undefined;

let createSession = exports.createSession = (() => {
  var _ref = _asyncToGenerator(function* (registerUrl) {
    let sessionId = arguments.length <= 1 || arguments[1] === undefined ? String(Date.now()) : arguments[1];

    (0, _debug2.default)('Create session %s at %s ...', sessionId, registerUrl);

    const response = yield (0, _nodeFetch2.default)(registerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ session_id: sessionId })
    });

    if (!response.ok) {
      throw new _errors.ResponseStatusError('Server error', response.status);
    }

    const body = yield response.json();
    if (!body.ok) {
      throw new _errors.ResponseContentError('Invalid body', body);
    }

    (0, _debug2.default)('Session Created: ${sessionId}');
    return sessionId;
  });

  return function createSession(_x2) {
    return _ref.apply(this, arguments);
  };
})();

let fetchData = exports.fetchData = (() => {
  var _ref2 = _asyncToGenerator(function* (fetchUrl, sessionId) {
    (0, _debug2.default)('Fetching data...');

    const response = yield (0, _nodeFetch2.default)(fetchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ session_id: sessionId })
    });

    if (!response.ok) {
      throw new _errors.ResponseStatusError('Server error', response.status);
    }

    const serverData = yield response.json();

    if (!serverData.ok) {
      throw new _errors.ResponseContentError('Invalid body', serverData);
    }

    return serverData.data.map(parseEntry);
  });

  return function fetchData(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
})();

exports.parseEntry = parseEntry;
exports.buildUrls = buildUrls;

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _debug = require('./debug');

var _debug2 = _interopRequireDefault(_debug);

var _errors = require('./errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const ENTRY_REGEXP = /^\[(\w+)\] dry_run: (true|false), valid message:(.*)/;

function parseEntry(entry) {
  const matches = ENTRY_REGEXP.exec(entry);
  return {
    project: matches[1],
    dryRun: JSON.parse(matches[2]),
    message: JSON.parse(matches[3])
  };
}

function buildUrls(host) {
  return {
    registerSession: _url2.default.resolve(host, 'accessories/debug_data_session_register'),
    fetchData: _url2.default.resolve(host, 'accessories/debug_data_fetch')
  };
}