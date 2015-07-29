import {Parser, Token, Fragment, types} from 'cst';

function newline(elem) {
  let code = '\n' + elem.sourceCode.replace(/\n/g, '');

  return new Token('Whitespace', code);
}

export default function migration(input) {
  let parser = new Parser();
  let program = parser.parse(input);

  // Find all call relevant call expressions
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

  // Now lets change CST
  }).forEach((callExpression) => {

    // Remeber value of the second argument
    let numberLiteral = callExpression.arguments[1];

    // Remember the comma after the argument we want to remove
    let comma = numberLiteral.previousNonWhitespaceToken;

    // Remove deprecated argument
    callExpression.replaceChildren(
      new Fragment([]),
      comma,
      numberLiteral
    );

    // Find funarg of the test declaration
    let body = callExpression.arguments[1].body;

    // Found first elemenet after "{" symbol
    let elem = body.firstChild.nextSibling;

    let start;

    // If first element is a whitespace - save indentation
    if (elem.isWhitespace) {
      start = newline(elem);

    } else {

      // If this is not a newline (edge case)
      // just add newline char
      start = new Token('Whitespace', '\n');
    }

    // create "expect( <number> )" line
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

    // Let's add "expect( <number> );" after first "{" of the funarg
    body.insertChildBefore(
      new Fragment([
        start,
        expression,
        new Token('Whitespace', ';'),
        end
      ]),
      elem
    );

    // Remove sequential newline chars after "expect( <numeric> );"
    // so there would be only one newline
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
