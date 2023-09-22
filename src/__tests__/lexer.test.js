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
});
