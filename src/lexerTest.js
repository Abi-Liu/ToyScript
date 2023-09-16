const lexer = require("./lexer");

const input = "let x = 45";

const tokens = lexer(input);

console.log(tokens);
