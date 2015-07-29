'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.paths = paths;
exports.migrate = migrate;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _migration = require('./migration');

var _migration2 = _interopRequireDefault(_migration);

var _fs = require('fs');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

function paths(ps) {
  var result = [];

  ps.forEach(function (p) {
    p = _path2['default'].join(process.cwd(), p);

    _glob2['default'].sync(p).forEach(function (res) {
      return result.push(res);
    });
  });

  return result;
}

function migrate(ps) {
  ps = Array.isArray(ps) ? ps : [ps];

  paths(ps).forEach(function (p) {
    (0, _fs.writeFileSync)(p, (0, _migration2['default'])((0, _fs.readFileSync)(p, 'utf-8')));
  });
}