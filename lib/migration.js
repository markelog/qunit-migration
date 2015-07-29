'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = migration;

var _cst = require('cst');

function migration(input) {
  var parser = new _cst.Parser();
  var program = parser.parse(input);

  program.selectNodesByType('CallExpression').filter(function (callExpression) {
    if (callExpression.callee.type !== 'Identifier') {
      return false;
    }

    if (callExpression.callee.name !== 'test') {
      return false;
    }

    if (callExpression.arguments.length !== 3) {
      return false;
    }

    if (typeof callExpression.arguments[1].value !== 'number') {
      return false;
    }

    return true;
  }).forEach(function (callExpression) {

    var numberLiteral = callExpression.arguments[1];
    var comma = numberLiteral.previousNonWhitespaceToken;

    callExpression.replaceChildren(new _cst.Fragment([]), comma, numberLiteral);

    var body = callExpression.arguments[1].body;
    var elem = body.firstChild.nextSibling;

    body.insertChildBefore(new _cst.Fragment([elem.isWhitespace ? elem.cloneElement() : new _cst.Token('Whitespace', '\n'), new _cst.types.ExpressionStatement([new _cst.types.CallExpression([new _cst.types.Identifier([new _cst.Token('Identifier', 'expect')]), new _cst.Token('Punctuator', '('), new _cst.Token('Whitespace', ' '), numberLiteral, new _cst.Token('Whitespace', ' '), new _cst.Token('Punctuator', ')')])]), new _cst.Token('Whitespace', ';'), new _cst.Token('Whitespace', '\n')]), elem);
  });

  return program.sourceCode;
}

module.exports = exports['default'];