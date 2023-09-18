const Parser = require("./parser");
const evaluate = require("./Runtime/evaluator");
const Environment = require("./Runtime/environment");

const env = new Environment(null);
env.declareVar("x", { value: 100, type: "number" });
const input = "x+5";

const parser = new Parser();

let program = parser.produceAST(input);

const result = evaluate(program, env);

console.log(result);
