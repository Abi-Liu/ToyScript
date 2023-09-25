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

  expect(type, msg) {
    const prev = this.tokens.shift();
    if (!prev || prev.type !== type) {
      throw new Error(`${msg}`);
    }
    return prev;
  }

  parseStatement() {
    switch (this.at().type) {
      case "Let":
      case "Const":
        return this.parseVarDeclaration();
      case "Function":
        return this.parseFuncDeclaration();
      default:
        return this.parseExpr();
    }
  }

  parseFuncDeclaration() {
    this.next(); // move past the fn keyword
    const name = this.expect(
      "Identifier",
      "Invalid function name. Function name must be a valid identifier"
    ).value;

    const parameters = this.parseParams();
    this.expect(
      "CloseParen",
      "Missing close parentheses after parameters list"
    );

    const body = this.parseFuncBody();

    const fn = {
      type: "FunctionDeclaration",
      name,
      parameters,
      body,
    };

    return fn;
  }

  parseParams() {
    this.expect(
      "OpenParen",
      "Missing parameter list after function declaration"
    );
    let params;
    // if the next token is ')' we know there are no parameters
    if (this.at().type == "CloseParen") {
      params = [];
    } else {
      params = [this.parseExpr()];
      // loop until we no longer have any commas, therefore there are no more parameters and we are likely at a ')'
      while (this.notEof() && this.at().type == "Comma") {
        this.next(); // move past comma
        params.push(this.parseExpr());
      }
    }
    return params;
  }

  parseFuncBody() {
    this.expect(
      "OpenCurly",
      "Missing open curly brace to define function body"
    );
    if (this.at().type === "CloseCurly") {
      throw "Missing function body";
    }
    const body = [];
    while (this.notEof() && this.at().type !== "CloseCurly") {
      body.push(this.parseExpr());
    }
    return body;
  }

  parseVarDeclaration() {
    // true if const, false if let
    const isConst = this.next().type == "Const";
    // after a let/const there needs to be a variable identifier
    const identifier = this.expect(
      "Identifier",
      `Expected identifier after a variable declaration statement`
    ).value;

    if (this.at().type === "Semicolon") {
      this.next(); // Move past semicolon
      if (isConst) {
        throw "Must assign value to a constant variable";
      } else {
        return {
          type: "VariableDeclaration",
          identifier,
          constant: isConst,
          value: undefined,
        };
      }
    }
    this.expect(
      "Equals",
      "Expected '=' after identifier in variable declaration"
    );
    const value = this.parseExpr();
    return {
      type: "VariableDeclaration",
      constant: isConst,
      value,
      identifier,
    };
  }

  parseExpr() {
    return this.parseAssignmentExpr();
  }

  parseAssignmentExpr() {
    const left = this.parseObjectExpr();
    if (this.at().type == "Equals") {
      this.next();
      const value = this.parseAssignmentExpr();
      return { value, type: "AssignmentExpr", assignee: left };
    }

    return left;
  }

  parseObjectExpr() {
    if (this.at().type !== "OpenCurly") {
      return this.parseAdditiveExpr();
    }
    this.next(); // move past '{'
    const properties = [];
    // {key: value, key1: value2}
    while (this.notEof() && this.at().type !== "CloseCurly") {
      const key = this.expect(
        "Identifier",
        "Object key must be a string"
      ).value;

      this.expect("Colon", "Missing colon in object key value pair");
      const value = this.parseExpr();
      properties.push({ type: "Property", value, key });

      if (this.at().type !== "CloseCurly") {
        this.expect("Comma", "Missing comma separating key value pairs");
      }
    }
    this.expect("CloseCurly", "Object literal missing closing curly brace");
    return { type: "ObjectLiteral", properties };
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
    let left = this.parseCallMemberExpr();

    while (
      this.at().value == "*" ||
      this.at().value === "/" ||
      this.at().value === "%"
    ) {
      const operator = this.next().value;
      const right = this.parseCallMemberExpr();
      left = {
        type: "BinaryExpr",
        left,
        right,
        operator,
      };
    }

    return left;
  }

  // example: foo.bar()
  // we need to first evaluate foo.bar before checking for parentheses
  parseCallMemberExpr() {
    const member = this.parseMemberExpr();

    if (this.at().type === "OpenParen") {
      return this.parseCallExpr(member);
    }

    return member;
  }

  parseCallExpr(caller) {
    let callExpression = {
      type: "CallExpr",
      caller,
      args: this.parseArgs(),
    };

    if (this.at().type == "OpenParen") {
      callExpression = this.parseCallExpr(callExpression);
    }
    return callExpression;
  }

  // function add(x,y) - these are PARAMETERS
  // this function is for when you call a function
  // add(5, 2) - these are ARGUMENTS
  parseArgs() {
    this.expect("OpenParen", "Expected open parenthesis");
    const args = this.at().type == "CloseParen" ? [] : this.parseArgsList();
    this.expect("CloseParen", "Missing closing parentheses in function call");

    return args;
  }

  parseArgsList() {
    const args = [this.parseExpr()];

    while (this.notEof() && this.at().type == "Comma") {
      this.next();
      args.push(this.parseExpr());
    }

    return args;
  }

  parseMemberExpr() {
    let object = this.parsePrimaryExpr();

    while (this.at().type == "Period") {
      this.next();

      let property = this.parsePrimaryExpr();
      if (property.type !== "Identifier") {
        throw "Cannot use dot operator without identifier";
      }
      object = { type: "MemberExpr", object, property };
    }

    return object;
  }

  parsePrimaryExpr() {
    const token = this.at().type;

    switch (token) {
      case "Identifier":
        return { type: "Identifier", symbol: this.next().value };
      case "Number":
        return {
          type: "NumericLiteral",
          value: parseFloat(this.next().value),
        };
      case "OpenParen":
        this.next(); // move to the token after the '('
        const value = this.parseExpr();
        this.expect("CloseParen", "Missing closing parentheses"); // this is to move past the ')' token
        return value;
      default:
        throw new Error("Unexpected token found during parsing", this.at());
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
