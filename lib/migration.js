import {Parser, Token, Fragment, types} from 'cst';

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

    body.insertChildBefore(
      new Fragment([
        elem.isWhitespace ? elem.cloneElement() : new Token('Whitespace', '\n'),
        new types.ExpressionStatement([
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
        ]),
        new Token('Whitespace', ';'),
        new Token('Whitespace', '\n')
      ]),
      elem
    );
  });

  return program.sourceCode;
}
