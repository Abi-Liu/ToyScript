function evaluateProgram(program) {
  let lastEvaluated = { type: "null", value: "null" };

  // evaluates each child node in the AST
  for (const statement of program.body) {
    lastEvaluated = evaluate(statement);
  }

  return lastEvaluated;
}

// in the case that either left or right is another binary expression
// it will continue to recursively call itself until it gets down to the base case where both left and right are numeric literals
// and bubble back up to get the numeric values of the original binary expressions
function evaluateBinary(binary) {
  const left = evaluate(binary.left);
  const right = evaluate(binary.right);
  // makes sure that both left and right hand side are number values
  if (left.type === "number" && right.type === "number") {
    return evaluateNumericBinary(left, right, binary.operator);
  } else {
    return { type: "null", value: "null" };
  }
}

function evaluateNumericBinary(left, right, operator) {
  let res = 0;
  if (operator === "+") {
    res = left.value + right.value;
  } else if (operator === "-") {
    res = left.value - right.value;
  } else if (operator === "*") {
    res = left.value * right.value;
  } else if (operator === "/") {
    if (right.value === 0) {
      console.error("Cannot divide by 0");
      process.exit(1);
    }
    result = left.value / right.value;
  } else if (operator === "%") {
    if (right.value === 0) {
      console.error("Cannot divide by 0");
      process.exit(1);
    }
    result = left.value % right.value;
  }

  return { value: res, type: "number" };
}

function evaluate(ast) {
  switch (ast.type) {
    case "NumericLiteral":
      return { type: "number", value: ast.value };

    case "NullLiteral":
      return { type: "null", value: "null" };

    case "BinaryExpr":
      return evaluateBinary(ast);

    case "Program":
      return evaluateProgram(ast);

    default:
      console.error(`Unrecognized AST Node: ${ast}`);
      process.exit(1);
  }
}

module.exports = evaluate;
