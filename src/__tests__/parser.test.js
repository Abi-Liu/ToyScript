const Parser = require("../Parsing/parser");

describe("Parser tests", () => {
  const parser = new Parser();
  test("Test for atomic expressions", () => {
    const input = "x y test numbers 1 2 10421 231 74";
    expect(parser.produceAST(input)).toEqual({
      type: "Program",
      body: [
        { type: "Identifier", symbol: "x" },
        { type: "Identifier", symbol: "y" },
        { type: "Identifier", symbol: "test" },
        { type: "Identifier", symbol: "numbers" },
        { type: "NumericLiteral", value: 1 },
        { type: "NumericLiteral", value: 2 },
        { type: "NumericLiteral", value: 10421 },
        { type: "NumericLiteral", value: 231 },
        { type: "NumericLiteral", value: 74 },
      ],
    });
  });

  test("Test for open parentheses without a closing", () => {
    const input = "(sdf, 123";
    expect(() => parser.produceAST(input)).toThrowError(
      "Missing closing parentheses"
    );
  });

  test("Test for valid parentheses", () => {
    const input = "(asdf)";
    expect(parser.produceAST(input)).toEqual({
      type: "Program",
      body: [{ type: "Identifier", symbol: "asdf" }],
    });
  });

  test("For simple binary expression", () => {
    const input = "5+3";
    expect(parser.produceAST(input)).toEqual({
      body: [
        {
          left: {
            type: "NumericLiteral",
            value: 5,
          },
          operator: "+",
          right: {
            type: "NumericLiteral",
            value: 3,
          },
          type: "BinaryExpr",
        },
      ],
      type: "Program",
    });
  });

  test("for complex binary expression", () => {
    const input = "3*(4+1)/6 +3";
    expect(parser.produceAST(input)).toEqual({
      body: [
        {
          left: {
            left: {
              left: {
                type: "NumericLiteral",
                value: 3,
              },
              operator: "*",
              right: {
                left: {
                  type: "NumericLiteral",
                  value: 4,
                },
                operator: "+",
                right: {
                  type: "NumericLiteral",
                  value: 1,
                },
                type: "BinaryExpr",
              },
              type: "BinaryExpr",
            },
            operator: "/",
            right: {
              type: "NumericLiteral",
              value: 6,
            },
            type: "BinaryExpr",
          },
          operator: "+",
          right: {
            type: "NumericLiteral",
            value: 3,
          },
          type: "BinaryExpr",
        },
      ],
      type: "Program",
    });
  });

  test("for let variable declarations", () => {
    const input = "let x = 5";
    expect(parser.produceAST(input)).toEqual({
      body: [
        {
          constant: false,
          identifier: "x",
          type: "VariableDeclaration",
          value: {
            type: "NumericLiteral",
            value: 5,
          },
        },
      ],
      type: "Program",
    });
  });

  test("for const variable declarations", () => {
    const input = "const x = 5";
    expect(parser.produceAST(input)).toEqual({
      body: [
        {
          constant: true,
          identifier: "x",
          type: "VariableDeclaration",
          value: {
            type: "NumericLiteral",
            value: 5,
          },
        },
      ],
      type: "Program",
    });
  });

  test("for object declarations with nested objects", () => {
    const input = "let x = {one: 1, two: 2, three: {four: 4}}";
    expect(parser.produceAST(input)).toEqual({
      body: [
        {
          constant: false,
          identifier: "x",
          type: "VariableDeclaration",
          value: {
            properties: [
              {
                key: "one",
                type: "Property",
                value: {
                  type: "NumericLiteral",
                  value: 1,
                },
              },
              {
                key: "two",
                type: "Property",
                value: {
                  type: "NumericLiteral",
                  value: 2,
                },
              },
              {
                key: "three",
                type: "Property",
                value: {
                  properties: [
                    {
                      key: "four",
                      type: "Property",
                      value: {
                        type: "NumericLiteral",
                        value: 4,
                      },
                    },
                  ],
                  type: "ObjectLiteral",
                },
              },
            ],
            type: "ObjectLiteral",
          },
        },
      ],
      type: "Program",
    });
  });

  test("for function declarations", () => {
    const input = "fn add(x,y){x+y}";
    expect(parser.produceAST(input)).toEqual({
      body: [
        {
          body: [
            {
              left: {
                symbol: "x",
                type: "Identifier",
              },
              operator: "+",
              right: {
                symbol: "y",
                type: "Identifier",
              },
              type: "BinaryExpr",
            },
          ],
          name: "add",
          parameters: [
            {
              symbol: "x",
              type: "Identifier",
            },
            {
              symbol: "y",
              type: "Identifier",
            },
          ],
          type: "FunctionDeclaration",
        },
      ],
      type: "Program",
    });
  });

  test("function calls", () => {
    const input = "add(1,2)";
    expect(parser.produceAST(input)).toEqual({
      body: [
        {
          args: [
            {
              type: "NumericLiteral",
              value: 1,
            },
            {
              type: "NumericLiteral",
              value: 2,
            },
          ],
          caller: {
            symbol: "add",
            type: "Identifier",
          },
          type: "CallExpr",
        },
      ],
      type: "Program",
    });
  });

  test("for single quote strings", () => {
    const input = "'hello my name is bob'";
    expect(parser.produceAST(input)).toEqual({
      body: [
        {
          type: "StringLiteral",
          value: "hello my name is bob",
        },
      ],
      type: "Program",
    });
  });

  test("for double quote strings", () => {
    const input = '"hello my name is bob"';
    expect(parser.produceAST(input)).toEqual({
      body: [
        {
          type: "StringLiteral",
          value: "hello my name is bob",
        },
      ],
      type: "Program",
    });
  });

  test("adding strings", () => {
    const input = '"hello" + "bob"';
    expect(parser.produceAST(input)).toEqual({
      body: [
        {
          left: {
            type: "StringLiteral",
            value: "hello",
          },
          operator: "+",
          right: {
            type: "StringLiteral",
            value: "bob",
          },
          type: "BinaryExpr",
        },
      ],
      type: "Program",
    });
  });
});
