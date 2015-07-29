import {Parser, Token, Fragment, types} from 'cst';

function newline(elem) {
  let code = '\n' + elem.sourceCode.replace(/\n/g, '');

  return new Token('Whitespace', code);
}

export default function migration(input) {
  let parser = new Parser();
  let program = parser.parse(input);

  program.selectNodesByType('CallExpression').filter((callExpression) => {
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
  }).forEach((callExpression) => {

    let numberLiteral = callExpression.arguments[1];
    let comma = numberLiteral.previousNonWhitespaceToken;

    callExpression.replaceChildren(
      new Fragment([]),
      comma,
      numberLiteral
    );

    let body = callExpression.arguments[1].body;
    let elem = body.firstChild.nextSibling;

    let start;
    if (elem.isWhitespace) {
      start = newline(elem);

    } else {
      start = new Token('Whitespace', '\n');
    }

    let expression = new types.ExpressionStatement([
      new types.CallExpression([
        new types.Identifier([
          new Token('Identifier', 'expect')
        ]),
        new Token('Punctuator', '('),
        new Token('Whitespace', ' '),
        numberLiteral,
        new Token('Whitespace', ' '),
        new Token('Punctuator', ')')
      ])
    ]);

    let end = new Token('Whitespace', '\n');

    body.insertChildBefore(
      new Fragment([
        start,
        expression,
        new Token('Whitespace', ';'),
        end
      ]),
      elem
    );

    if (elem.isWhitespace) {
      body.replaceChildren(
        newline(end.nextSibling),
        end.nextSibling,
        end.nextSibling
      );
    }
  });

  return program.sourceCode;
}
