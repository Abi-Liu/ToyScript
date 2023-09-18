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

  expect(type) {
    const prev = this.tokens.shift();
    if (!prev || prev.type != type) {
      console.error(`Expected ${type}, received ${prev}`);
      process.exit(1);
    }
    return prev;
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
  // the more precedence an expression has, the further down the tree we want to parse it

  // + - binary expressions
  // because this has the less precendence than multiplication, we the left hand side will call parseMultiplicativeExpr. If the expression is not a multiplication expression, then it will just return the original left hand value.
  parseAdditiveExpr() {
    let left = this.parseMultiplicativeExpr();

    while (this.at().value == "+" || this.at().value === "-") {
      const operator = this.next().value;
      const right = this.parseMultiplicativeExpr();
      left = {
        type: "BinaryExpr",
        left,
        right,
        operator,
      };
    }

    return left;
  }

  // * / and % binary expressions.
  // because primary expressions have the most precedence, we will call that to be the left value

  parseMultiplicativeExpr() {
    let left = this.parsePrimaryExpr();

    while (
      this.at().value == "*" ||
      this.at().value === "/" ||
      this.at().value === "%"
    ) {
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
      case "OpenParen":
        this.next(); // move to the token after the '('
        const value = this.parseExpr();
        this.expect("CloseParen"); // this is to move past the ')' token
        return value;
      case "Null":
        this.next(); // to move past null keyword
        return { type: "NullLiteral", value: "null}" };
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
