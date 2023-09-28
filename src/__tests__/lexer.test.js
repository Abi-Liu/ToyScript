const lexer = require("../Parsing/lexer");

describe("Lexer test", () => {
  test("Test for one line of random strings and characters and symbols", () => {
    const input = "asdf 2341 { sdflkj ( } . )";
    expect(lexer(input)).toEqual([
      { value: "asdf", type: "Identifier" },
      { value: "2341", type: "Number" },
      { value: "{", type: "OpenCurly" },
      { value: "sdflkj", type: "Identifier" },
      { value: "(", type: "OpenParen" },
      { value: "}", type: "CloseCurly" },
      { value: ".", type: "Period" },
      { value: ")", type: "CloseParen" },
      { value: "EOF", type: "EOF" },
    ]);
  });

  test("for keywords", () => {
    const input = "let const";
    expect(lexer(input)).toEqual([
      { value: "let", type: "Let" },
      { value: "const", type: "Const" },
      { value: "EOF", type: "EOF" },
    ]);
  });

  test("for white space, tabs, line breaks and carriage returns", () => {
    const input =
      "\n \t let const \r = foo bar() \n 45123, \n boo \r yes \t hello";
    expect(lexer(input)).toEqual([
      { value: "let", type: "Let" },
      { value: "const", type: "Const" },
      { value: "=", type: "Equals" },
      { value: "foo", type: "Identifier" },
      { value: "bar", type: "Identifier" },
      { value: "(", type: "OpenParen" },
      { value: ")", type: "CloseParen" },
      { value: "45123", type: "Number" },
      { value: ",", type: "Comma" },
      { value: "boo", type: "Identifier" },
      { value: "yes", type: "Identifier" },
      { value: "hello", type: "Identifier" },
      { value: "EOF", type: "EOF" },
    ]);
  });

  test("Throws error on unrecognized token", () => {
    const input = "let $var = 42;";
    expect(() => {
      lexer(input);
    }).toThrowError("Unrecognized character found in source: $");
  });

  test("Test for function declarations", () => {
    const input = "fn add(x,y){x+y}";
    expect(lexer(input)).toEqual([
      { type: "Function", value: "fn" },
      { type: "Identifier", value: "add" },
      { type: "OpenParen", value: "(" },
      { type: "Identifier", value: "x" },
      { type: "Comma", value: "," },
      { type: "Identifier", value: "y" },
      { type: "CloseParen", value: ")" },
      { type: "OpenCurly", value: "{" },
      { type: "Identifier", value: "x" },
      { type: "BinaryOperator", value: "+" },
      { type: "Identifier", value: "y" },
      { type: "CloseCurly", value: "}" },
      { type: "EOF", value: "EOF" },
    ]);
  });

  test("Function calls", () => {
    const input = "add(1,2)";
    expect(lexer(input)).toEqual([
      {
        type: "Identifier",
        value: "add",
      },
      {
        type: "OpenParen",
        value: "(",
      },
      {
        type: "Number",
        value: "1",
      },
      {
        type: "Comma",
        value: ",",
      },
      {
        type: "Number",
        value: "2",
      },
      {
        type: "CloseParen",
        value: ")",
      },
      {
        type: "EOF",
        value: "EOF",
      },
    ]);
  });

  test("for single quoted strings", () => {
    const input = "'hello my name is bob'";
    expect(lexer(input)).toEqual([
      { type: "StringLiteral", value: "'hello my name is bob'" },
      { type: "EOF", value: "EOF" },
    ]);
  });

  test("for double quoted strings", () => {
    const input = '"hello my name is bob"';
    expect(lexer(input)).toEqual([
      { type: "StringLiteral", value: '"hello my name is bob"' },
      { type: "EOF", value: "EOF" },
    ]);
  });

  test("for double quoted strings missing closing quote", () => {
    const input = '"hello my name is bob';
    expect(() => lexer(input)).toThrowError("Missing closing double quote");
  });

  test("for single quoted strings missing closing quote", () => {
    const input = "'hello my name is bob";
    expect(() => lexer(input)).toThrowError("Missing closing single quote");
  });

  test("for logical and conditional operators", () => {
    const input = "!= <= == >= < > ! && || ";
    expect(lexer(input)).toEqual([
      { type: "ComparisonOperator", value: "!=" },
      { type: "ComparisonOperator", value: "<=" },
      { type: "ComparisonOperator", value: "==" },
      { type: "ComparisonOperator", value: ">=" },
      { type: "ComparisonOperator", value: "<" },
      { type: "ComparisonOperator", value: ">" },
      { type: "UnaryOperator", value: "!" },
      { type: "LogicalOperator", value: "&&" },
      { type: "LogicalOperator", value: "||" },
      { type: "EOF", value: "EOF" },
    ]);
  });

  test("if elseif else keywords", () => {
    const input = "if elseif else";
    expect(lexer(input)).toEqual([
      { type: "IfStatement", value: "if" },
      { type: "ElseIfStatement", value: "elseif" },
      { type: "ElseStatement", value: "else" },
      { type: "EOF", value: "EOF" },
    ]);
  });
});
