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
    expect(evaluate(result, env)).toEqual({});
  });
});
