'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResponseContentError = exports.ResponseStatusError = undefined;

var _debug = require('./debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let ResponseStatusError = exports.ResponseStatusError = class ResponseStatusError extends Error {
  constructor(message, statusCode) {
    super(message);
    Error.captureStackTrace(this, ResponseStatusError);
    this.statusCode = statusCode;

    (0, _debug2.default)('Server Status Error [%s]: %s', statusCode, message);
  }
};
let ResponseContentError = exports.ResponseContentError = class ResponseContentError extends Error {
  constructor(message, body) {
    super(message);
    Error.captureStackTrace(this, ResponseContentError);
    this.body = body;

    (0, _debug2.default)('Response Content Error: %s -> %j', message, body);
  }
};