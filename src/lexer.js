// reserved keywords
const KEYWORDS = {
  let: "Let",
  null: "Null",
};

// Returns a token of a given type and value
function token(value, type) {
  return { value, type };
}

/**
 * Returns whether the character passed in alphabetic -> [a-zA-Z]
 */
function isAlpha(str) {
  return str.toUpperCase() != str.toLowerCase();
}

/**
 * Returns true if the character is whitespace like -> [\s, \t, \n]
 */
function isSkippable(str) {
  return str == " " || str == "\n" || str == "\t";
}

/**
 Return whether the character is a valid integer -> [0-9]
 */
function isInt(str) {
  const c = str.charCodeAt(0);
  const bounds = ["0".charCodeAt(0), "9".charCodeAt(0)];
  return c >= bounds[0] && c <= bounds[1];
}

// given a string, produce and return an array of tokens.

function tokenize(sourceCode) {
  const tokens = [];

  // split source code so we can parse each character.
  const src = sourceCode.split("");

  // produce tokens until the EOF is reached.
  while (src.length > 0) {
    // BEGIN PARSING ONE CHARACTER TOKENS
    if (src[0] == "(") {
      tokens.push(token(src.shift(), "OpenParen"));
    } else if (src[0] == ")") {
      tokens.push(token(src.shift(), "CloseParen"));
    } // HANDLE BINARY OPERATORS
    else if (
      src[0] == "+" ||
      src[0] == "-" ||
      src[0] == "*" ||
      src[0] == "/" ||
      src[0] == "%"
    ) {
      tokens.push(token(src.shift(), "BinaryOperator"));
    } // Handle Conditional & Assignment Tokens
    else if (src[0] == "=") {
      tokens.push(token(src.shift(), "Equals"));
    } // HANDLE MULTICHARACTER KEYWORDS, TOKENS, IDENTIFIERS ETC...
    else {
      // Handle numeric literals -> Integers
      if (isInt(src[0])) {
        let num = "";
        while (src.length > 0 && isInt(src[0])) {
          num += src.shift();
        }

        // append new numeric token.
        tokens.push(token(num, "Number"));
      } // Handle Identifier & Keyword Tokens.
      else if (isAlpha(src[0])) {
        let str = "";
        while (src.length > 0 && isAlpha(src[0])) {
          str += src.shift();
        }

        // CHECK FOR RESERVED KEYWORDS
        const reserved = KEYWORDS[str];
        // If value is not undefined then the identifier is a reconized keyword
        if (reserved) {
          tokens.push(token(str, reserved));
        } else {
          // Unreconized name must mean user defined symbol.
          tokens.push(token(str, "Identifier"));
        }
      } else if (isSkippable(src[0])) {
        // Skip unneeded chars.
        src.shift();
      } // Handle unreconized characters.
      // TODO: Impliment better errors and error recovery.
      else {
        console.error("Unreconized character found in source: ", src[0]);
        process.exit(1);
      }
    }
  }
  tokens.push({ value: "EOF", type: "EOF" });
  return tokens;
}

module.exports = tokenize;
