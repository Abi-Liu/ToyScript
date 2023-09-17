const lexer = require("./lexer");
const Parser = require("./parser");

const input = "5+10+3";

const parser = new Parser();

let res = parser.produceAST(input);

// console.log(res);

console.log(res.body[0].left);
// console.log(res.body[0].right);
