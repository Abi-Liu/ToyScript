const tokenize = require("./lexer");

class Parser {
  constructor() {
    this.tokens = [];
  }

  // makes sure it's not the end of file
  notEof() {
    return this.tokens[0].type !== "EOF";
  }

  // gets current token but doesn't advance
  at() {
    return this.tokens[0];
  }

  // returns current token and advances to the next token
  next() {
    return this.tokens.shift();
  }

  parseStatement() {
    // skip to parseExpr
    return this.parseExpr();
  }

  parseExpr() {
    return this.parseAdditiveExpr();
  }

  // Need to handle orders of precedence
  // primary expression -> unary -> Multiplicative -> additive -> comparisons -> logical

  parseAdditiveExpr() {
    let left = this.parsePrimaryExpr();

    while (this.at().value == "+" || this.at().value === "-") {
      const operator = this.next().value;
      const right = this.parsePrimaryExpr();
      left = {
        type: "BinaryExpr",
        left,
        right,
        operator,
      };
    }

    return left;
  }

  parsePrimaryExpr() {
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
    while (this.notEof()) {
      program.body.push(this.parseStatement());
    }

    return program;
  }
}

module.exports = Parser;
