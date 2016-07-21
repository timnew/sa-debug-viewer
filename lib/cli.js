'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _DebugEventStream = require('./DebugEventStream');

var _DebugEventStream2 = _interopRequireDefault(_DebugEventStream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const args = _yargs2.default.usage('sa-debug [options] <host>').option('project', {
  alias: 'p',
  describe: 'Project to monitor',
  type: 'string'
}).option('event', {
  alias: 'e',
  describe: 'Event filter',
  type: 'array'
}).option('userId', {
  alias: 'u',
  describe: 'User id',
  type: 'array'
}).demand(1, 'Host must be provided').help('help').argv;

var _args$_ = _slicedToArray(args._, 1);

const host = _args$_[0];


const stream = new _DebugEventStream2.default(host);
let observable = stream.toObservable();

if (args.project != null) {
  observable = observable.filter(entry => entry.project === args.project);
}

if (args.event != null) {
  observable = observable.filter(entry => entry.message.type === 'track' && args.event.includes(entry.message.event));
}

if (args.event != null) {
  observable = observable.filter(entry => args.userId.includes(entry.message.distinct_id));
}

/* eslint-disable no-console */
observable.subscribe(data => console.info('Next: ', data), err => console.error('Error: ', err), () => console.info('Completed'));