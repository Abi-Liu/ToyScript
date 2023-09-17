const lexer = require("./lexer");
const Parser = require("./parser");

const input = "5+(5+10*3)";

const parser = new Parser();

let res = parser.produceAST(input);

console.dir(res);
