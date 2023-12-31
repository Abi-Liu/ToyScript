const Parser = require("./parser");
const evaluate = require("./Runtime/evaluator");
const Environment = require("./Runtime/environment");

const env = new Environment(null);
env.declareVar("x", { value: 100, type: "number" });
// creating true false and null values inside the global runtime
env.declareVar("true", { value: true, type: "boolean" }, true);
env.declareVar("false", { value: false, type: "boolean" }, true);
env.declareVar("null", { value: null, type: "null" }, true);
const input = "const f = 5 f + 3";

const parser = new Parser();

let program = parser.produceAST(input);

const result = evaluate(program, env);

console.log(result);
