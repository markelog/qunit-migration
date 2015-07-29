'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.paths = paths;
exports['default'] = reader;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _migration = require('./migration');

var _migration2 = _interopRequireDefault(_migration);

var _fs = require('fs');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function paths(ps) {
  return ps.map(function (p) {
    return _path2['default'].join(__dirname, '..', p);
  });
}

function reader(ps) {
  paths(ps).forEach(function (p) {
    (0, _fs.writeFileSync)(p, (0, _migration2['default'])((0, _fs.readFileSync)(p, 'utf-8')));
  });
}