const lexer = require("./lexer");
const Parser = require("./parser");

const input = "x 45";

const parser = new Parser();

console.log(parser.produceAST(input));
