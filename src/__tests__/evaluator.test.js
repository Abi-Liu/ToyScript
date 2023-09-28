const Parser = require("../Parsing/parser");
const evaluate = require("../Runtime/evaluator");
const Environment = require("../Runtime/environment");

describe("Evaluator Tests", () => {
  // setting up environment vars and parser object before each test runs
  let parser, env;
  beforeEach(() => {
    parser = new Parser();
    env = new Environment(null);
    // creating true false and null values inside the global runtime
    env.declareVar("true", { value: true, type: "boolean" }, true);
    env.declareVar("false", { value: false, type: "boolean" }, true);
    env.declareVar("null", { value: null, type: "null" }, true);

    // creating a native print function
    env.declareVar("print", {
      type: "NativeFunction",
      call: (args, env) => {
        console.log(...args);
        return { type: "null", value: null };
      },
    });
  });

  test("Valid Numeric Values", () => {
    const input = "32143";
    const result = parser.produceAST(input);
    expect(evaluate(result, env)).toEqual({
      type: "number",
      value: 32143,
    });
  });

  test("for let variable assignment with value", () => {
    const input = "let maxValue = 54";
    const result = parser.produceAST(input);
    expect(evaluate(result, env)).toEqual({ type: "number", value: 54 });
  });

  test("for variable reassignment with value", () => {
    const input = "let maxValue = 54 maxValue = true";
    const result = parser.produceAST(input);
    expect(evaluate(result, env)).toEqual({ type: "boolean", value: true });
  });

  test("for variable assignment without value", () => {
    const input = "let maxValue;";
    const result = parser.produceAST(input);
    expect(evaluate(result, env)).toEqual({ type: "null", value: null });
  });

  test("for const variable assignment with value", () => {
    const input = "const maxValue = 54";
    const result = parser.produceAST(input);
    expect(evaluate(result, env)).toEqual({ type: "number", value: 54 });
  });

  test("for const variable reassignment with value", () => {
    const input = "const maxValue = 54 maxValue = 3";
    const result = parser.produceAST(input);
    expect(() => evaluate(result, env)).toThrowError(
      "Cannot reassign a constant variable: maxValue"
    );
  });

  //   test("for const variable reassignment with value", () => {
  //     const input = "const maxValue;";
  //     const result = parser.produceAST(input);
  //     expect(() => evaluate(result, env)).toThrowError(
  //       "Must assign value to a constant variable"
  //     );
  //   });

  test("function declarations", () => {
    const input = "fn add(x,y){x+y}";
    const result = parser.produceAST(input);
    expect(evaluate(result, env)).toEqual(undefined);
  });

  test("function calls", () => {
    const input = "fn add(x,y){x+y} add(1,2)";
    const result = parser.produceAST(input);
    expect(evaluate(result, env)).toEqual({ type: "number", value: 3 });
  });

  test("Object assignments", () => {
    const input = "let  x = {one: 1, two: {three: 3}}";
    const result = parser.produceAST(input);
    expect(evaluate(result, env)).toEqual({
      properties: new Map([
        [
          "one",
          {
            type: "number",
            value: 1,
          },
        ],
        [
          "two",
          {
            properties: new Map([
              [
                "three",
                {
                  type: "number",
                  value: 3,
                },
              ],
            ]),
            type: "object",
          },
        ],
      ]),
      type: "object",
    });
  });

  test("for member access", () => {
    const input = "let  x = {one: 1, two: {three: 3}} x.two.three";
    const result = parser.produceAST(input);
    expect(evaluate(result, env)).toEqual({ type: "number", value: 3 });
  });

  test("For strings", () => {
    const input = "'hello bob'";
    const result = parser.produceAST(input);
    expect(evaluate(result, env)).toEqual({
      type: "string",
      value: "hello bob",
    });
  });

  test("For string assignments", () => {
    const input = "let x = 'hello bob' x";
    const result = parser.produceAST(input);
    expect(evaluate(result, env)).toEqual({
      type: "string",
      value: "hello bob",
    });
  });

  test("For adding strings", () => {
    const input = "let x = 'hello bob' x+'! How are you?'";
    const result = parser.produceAST(input);
    expect(evaluate(result, env)).toEqual({
      type: "string",
      value: "hello bob! How are you?",
    });
  });

  test("For Unary expressions", () => {
    let input = "!false";
    let result = parser.produceAST(input);
    expect(evaluate(result, env)).toEqual({
      type: "boolean",
      value: true,
    });

    input = "!true";
    result = parser.produceAST(input);
    expect(evaluate(result, env)).toEqual({
      type: "boolean",
      value: false,
    });

    input = '!"x"';
    result = parser.produceAST(input);
    expect(evaluate(result, env)).toEqual({
      type: "boolean",
      value: false,
    });

    input = "!1";
    result = parser.produceAST(input);
    expect(evaluate(result, env)).toEqual({
      type: "boolean",
      value: false,
    });
  });

  test("for logical expressions", () => {
    let input = "true || false";
    let result = parser.produceAST(input);
    expect(evaluate(result, env)).toEqual({
      type: "boolean",
      value: true,
    });

    input = "false || false";
    result = parser.produceAST(input);
    expect(evaluate(result, env)).toEqual({
      type: "boolean",
      value: false,
    });

    input = "true && false";
    result = parser.produceAST(input);
    expect(evaluate(result, env)).toEqual({
      type: "boolean",
      value: false,
    });

    input = "false && false";
    result = parser.produceAST(input);
    expect(evaluate(result, env)).toEqual({
      type: "boolean",
      value: false,
    });

    input = "true && true";
    result = parser.produceAST(input);
    expect(evaluate(result, env)).toEqual({
      type: "boolean",
      value: true,
    });
  });

  test("For comparison expression", () => {
    let input = "5==5";
    let result = parser.produceAST(input);
    expect(evaluate(result, env)).toEqual({
      type: "boolean",
      value: true,
    });

    input = "5==4";
    result = parser.produceAST(input);
    expect(evaluate(result, env)).toEqual({
      type: "boolean",
      value: false,
    });

    input = '"hi" == "hi"';
    result = parser.produceAST(input);
    expect(evaluate(result, env)).toEqual({
      type: "boolean",
      value: true,
    });

    input = "5>4";
    result = parser.produceAST(input);
    expect(evaluate(result, env)).toEqual({
      type: "boolean",
      value: true,
    });

    input = "5>=5";
    result = parser.produceAST(input);
    expect(evaluate(result, env)).toEqual({
      type: "boolean",
      value: true,
    });

    input = "5<4";
    result = parser.produceAST(input);
    expect(evaluate(result, env)).toEqual({
      type: "boolean",
      value: false,
    });

    input = "5<=4";
    result = parser.produceAST(input);
    expect(evaluate(result, env)).toEqual({
      type: "boolean",
      value: false,
    });

    input = "1 != 1";
    result = parser.produceAST(input);
    expect(evaluate(result, env)).toEqual({
      type: "boolean",
      value: false,
    });

    input = "1 != 2";
    result = parser.produceAST(input);
    expect(evaluate(result, env)).toEqual({
      type: "boolean",
      value: true,
    });

    input = "let x = 1 x != 2";
    result = parser.produceAST(input);
    expect(evaluate(result, env)).toEqual({
      type: "boolean",
      value: true,
    });

    input = '"hi" != "bye"';
    result = parser.produceAST(input);
    expect(evaluate(result, env)).toEqual({
      type: "boolean",
      value: true,
    });

    input = '"hi" != "bye" && true == true';
    result = parser.produceAST(input);
    expect(evaluate(result, env)).toEqual({
      type: "boolean",
      value: true,
    });
  });

  test("for if statements", () => {
    let input = "if(5>3){ 5 - 3}";
    let result = parser.produceAST(input);
    expect(evaluate(result, env)).toEqual({ type: "number", value: 2 });

    input = "if(5<3){ 5 - 3}";
    result = parser.produceAST(input);
    expect(evaluate(result, env)).toEqual({ type: "null", value: null });

    // for the case of manipulating variables declared in parent scope
    input = "let x = 5 if(x > 3){x = 5 - 3} x";
    result = parser.produceAST(input);
    expect(evaluate(result, env)).toEqual({ type: "number", value: 2 });
  });

  test("for if elseif statements", () => {
    let input = "if(5>3){ 5 - 3} elseif(3>5){ 3-5 }";
    let result = parser.produceAST(input);
    expect(evaluate(result, env)).toEqual({ type: "number", value: 2 });

    input = "if(5<3){ 5 - 3} elseif (5>3){ 3-5}";
    result = parser.produceAST(input);
    expect(evaluate(result, env)).toEqual({ type: "number", value: -2 });

    input = `if(5<3){ 5 - 3} elseif (1 >3){ 3-5} elseif(1==2){1+2}elseif(1==1){'one'}`;
    result = parser.produceAST(input);
    expect(evaluate(result, env)).toEqual({ type: "string", value: "one" });
  });

  test("for if elseif else statements", () => {
    let input = "if(5<3){ 5 - 3} else { 3-5 }";
    let result = parser.produceAST(input);
    expect(evaluate(result, env)).toEqual({ type: "number", value: -2 });

    input = "if(5<3){ 5 - 3} elseif (5 == 3){ 3-5} else {5*5}";
    result = parser.produceAST(input);
    expect(evaluate(result, env)).toEqual({ type: "number", value: 25 });

    input = `if(5<3){ 5 - 3} elseif (1 >3){ 3-5} elseif(1==2){1+2}elseif(1==3){'one'} else {'abc'}`;
    result = parser.produceAST(input);
    expect(evaluate(result, env)).toEqual({ type: "string", value: "abc" });
  });
});
