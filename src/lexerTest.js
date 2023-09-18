const Parser = require("./parser");
const evaluator = require("./Runtime/evaluator");

const input = "10+5";

const parser = new Parser();

let program = parser.produceAST(input);

console.log(program);
