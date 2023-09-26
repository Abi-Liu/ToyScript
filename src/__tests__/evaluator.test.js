const Parser = require("../Parsing/parser");
const evaluate = require("../Runtime/evaluator");
const Environment = require("../Runtime/environment");

describe("Evaluator Tests", () => {
  // setting up environment vars and parser object before each test runs
  let parser, env;
  beforeEach(() => {
    parser = new Parser();
    console.log(parser);
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

  test("Vali Numeric Values", () => {
    const input = "32143";
    const result = parser.produceAST(input);
    expect(evaluate(result)).toEqual({
      type: "number",
      value: 32143,
    });
  });
});
