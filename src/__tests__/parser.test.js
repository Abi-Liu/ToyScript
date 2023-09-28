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
    const input = "fn add(x,y){let sum =x+y}";
    expect(parser.produceAST(input)).toEqual({
      body: [
        {
          body: [
            {
              constant: false,
              identifier: "sum",
              type: "VariableDeclaration",
              value: {
                left: { symbol: "x", type: "Identifier" },
                operator: "+",
                right: { symbol: "y", type: "Identifier" },
                type: "BinaryExpr",
              },
            },
          ],
          name: "add",
          parameters: [
            { symbol: "x", type: "Identifier" },
            { symbol: "y", type: "Identifier" },
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

  test("For logical operators", () => {
    let input = "true || true";
    expect(parser.produceAST(input)).toEqual({
      body: [
        {
          left: { symbol: "true", type: "Identifier" },
          operator: "||",
          right: { symbol: "true", type: "Identifier" },
          type: "LogicalExpr",
        },
      ],
      type: "Program",
    });

    input = "true && true";
    expect(parser.produceAST(input)).toEqual({
      body: [
        {
          left: { symbol: "true", type: "Identifier" },
          operator: "&&",
          right: { symbol: "true", type: "Identifier" },
          type: "LogicalExpr",
        },
      ],
      type: "Program",
    });

    input = "(5>3 && 2<5 || 2>1)";
    expect(parser.produceAST(input)).toEqual({
      body: [
        {
          left: {
            left: {
              left: { type: "NumericLiteral", value: 5 },
              operator: ">",
              right: { type: "NumericLiteral", value: 3 },
              type: "ComparisonExpr",
            },
            operator: "&&",
            right: {
              left: { type: "NumericLiteral", value: 2 },
              operator: "<",
              right: { type: "NumericLiteral", value: 5 },
              type: "ComparisonExpr",
            },
            type: "LogicalExpr",
          },
          operator: "||",
          right: {
            left: { type: "NumericLiteral", value: 2 },
            operator: ">",
            right: { type: "NumericLiteral", value: 1 },
            type: "ComparisonExpr",
          },
          type: "LogicalExpr",
        },
      ],
      type: "Program",
    });
  });

  test("For comparison expressions", () => {
    let input = "5 > 2";
    expect(parser.produceAST(input)).toEqual({
      body: [
        {
          left: { type: "NumericLiteral", value: 5 },
          operator: ">",
          right: { type: "NumericLiteral", value: 2 },
          type: "ComparisonExpr",
        },
      ],
      type: "Program",
    });
    input = "5 == 2";
    expect(parser.produceAST(input)).toEqual({
      body: [
        {
          left: { type: "NumericLiteral", value: 5 },
          operator: "==",
          right: { type: "NumericLiteral", value: 2 },
          type: "ComparisonExpr",
        },
      ],
      type: "Program",
    });

    input = "5!=2";
    expect(parser.produceAST(input)).toEqual({
      body: [
        {
          left: { type: "NumericLiteral", value: 5 },
          operator: "!=",
          right: { type: "NumericLiteral", value: 2 },
          type: "ComparisonExpr",
        },
      ],
      type: "Program",
    });

    input = "5>= 2";
    expect(parser.produceAST(input)).toEqual({
      body: [
        {
          left: { type: "NumericLiteral", value: 5 },
          operator: ">=",
          right: { type: "NumericLiteral", value: 2 },
          type: "ComparisonExpr",
        },
      ],
      type: "Program",
    });

    input = "5<=2";
    expect(parser.produceAST(input)).toEqual({
      body: [
        {
          left: { type: "NumericLiteral", value: 5 },
          operator: "<=",
          right: { type: "NumericLiteral", value: 2 },
          type: "ComparisonExpr",
        },
      ],
      type: "Program",
    });

    input = "5<2";
    expect(parser.produceAST(input)).toEqual({
      body: [
        {
          left: { type: "NumericLiteral", value: 5 },
          operator: "<",
          right: { type: "NumericLiteral", value: 2 },
          type: "ComparisonExpr",
        },
      ],
      type: "Program",
    });
  });

  test("Unary operator", () => {
    input = "!(5*2)";
    expect(parser.produceAST(input)).toEqual({
      body: [
        {
          operand: {
            left: { type: "NumericLiteral", value: 5 },
            operator: "*",
            right: { type: "NumericLiteral", value: 2 },
            type: "BinaryExpr",
          },
          operator: "!",
          type: "UnaryExpr",
        },
      ],
      type: "Program",
    });
  });

  test("For if statements", () => {
    let input = "if(5 > 2){ true }";
    expect(parser.produceAST(input)).toEqual({
      body: [
        {
          condition: {
            left: { type: "NumericLiteral", value: 5 },
            operator: ">",
            right: { type: "NumericLiteral", value: 2 },
            type: "ComparisonExpr",
          },
          elseBlock: null,
          elseIfBlocks: [],
          ifBody: [{ symbol: "true", type: "Identifier" }],
          type: "IfStatement",
        },
      ],
      type: "Program",
    });

    input = "if(5 > 2){ let x = 5 x + 3 }";
    expect(parser.produceAST(input)).toEqual({
      body: [
        {
          condition: {
            left: { type: "NumericLiteral", value: 5 },
            operator: ">",
            right: { type: "NumericLiteral", value: 2 },
            type: "ComparisonExpr",
          },
          elseBlock: null,
          elseIfBlocks: [],
          ifBody: [
            {
              constant: false,
              identifier: "x",
              type: "VariableDeclaration",
              value: { type: "NumericLiteral", value: 5 },
            },
            {
              left: { symbol: "x", type: "Identifier" },
              operator: "+",
              right: { type: "NumericLiteral", value: 3 },
              type: "BinaryExpr",
            },
          ],
          type: "IfStatement",
        },
      ],
      type: "Program",
    });

    input = "if(5 > 2) let x = 5 x + 3 }";
    expect(() => parser.produceAST(input)).toThrowError();

    input = "if(5 > 2) {let x = 5 x + 3 ";
    expect(() => parser.produceAST(input)).toThrowError();

    input = "if(){ let x = 5 x + 3 }";
    expect(() => parser.produceAST(input)).toThrowError();

    input =
      "if(5 > 3){ let x = 5 x + 3 }elseif(5 < 3){ let x = 3 x + 3} elseif(1==2){10 + 2} else { x}";
    expect(parser.produceAST(input)).toEqual({
      body: [
        {
          condition: {
            left: { type: "NumericLiteral", value: 5 },
            operator: ">",
            right: { type: "NumericLiteral", value: 3 },
            type: "ComparisonExpr",
          },
          elseBlock: [{ symbol: "x", type: "Identifier" }],
          elseIfBlocks: [
            {
              body: [
                {
                  constant: false,
                  identifier: "x",
                  type: "VariableDeclaration",
                  value: { type: "NumericLiteral", value: 3 },
                },
                {
                  left: { symbol: "x", type: "Identifier" },
                  operator: "+",
                  right: { type: "NumericLiteral", value: 3 },
                  type: "BinaryExpr",
                },
              ],
              condition: {
                left: { type: "NumericLiteral", value: 5 },
                operator: "<",
                right: { type: "NumericLiteral", value: 3 },
                type: "ComparisonExpr",
              },
            },
            {
              body: [
                {
                  left: { type: "NumericLiteral", value: 10 },
                  operator: "+",
                  right: { type: "NumericLiteral", value: 2 },
                  type: "BinaryExpr",
                },
              ],
              condition: {
                left: { type: "NumericLiteral", value: 1 },
                operator: "==",
                right: { type: "NumericLiteral", value: 2 },
                type: "ComparisonExpr",
              },
            },
          ],
          ifBody: [
            {
              constant: false,
              identifier: "x",
              type: "VariableDeclaration",
              value: { type: "NumericLiteral", value: 5 },
            },
            {
              left: { symbol: "x", type: "Identifier" },
              operator: "+",
              right: { type: "NumericLiteral", value: 3 },
              type: "BinaryExpr",
            },
          ],
          type: "IfStatement",
        },
      ],
      type: "Program",
    });
  });
});
