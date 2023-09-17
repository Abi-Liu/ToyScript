const tokenize = require("./lexer");

class Parser {
  constructor() {
    this.tokens = [];
  }

  // makes sure it's not the end of file
  not_eof() {
    return this.tokens[0].type !== "EOF";
  }

  // gets current token but doesn't advance
  at() {
    return this.tokens[0];
  }

  // gets current token and advances to the next token
  next() {
    return this.tokens.shift();
  }

  parse_statement() {
    // skip to parse_expr
    return this.parse_expr();
  }

  parse_expr() {
    return this.parse_primary_expr();
  }

  parse_primary_expr() {
    const token = this.at().type;

    switch (token) {
      case "Identifier":
        return { type: "Identifier", symbol: this.next().value };
      case "Number":
        return {
          type: "NumericaLiteral",
          value: parseFloat(this.next().value),
        };
      default:
        console.error("Unexpected token found during parsing", this.at());
        process.exit(1);
    }
  }

  produceAST(sourceCode) {
    this.tokens = tokenize(sourceCode);
    const program = { type: "Program", body: [] };

    // parse until end of the file is reached
    while (this.not_eof()) {
      program.body.push(this.parse_statement());
    }

    return program;
  }
}

module.exports = Parser;
