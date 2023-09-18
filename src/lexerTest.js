const lexer = require("./lexer");
const Parser = require("./parser");

const input = "null";

const parser = new Parser();

let res = parser.produceAST(input);

console.dir(res);
