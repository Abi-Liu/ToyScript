function evaluateProgram(program, env) {
  let lastEvaluated = { type: "null", value: "null" };

  // evaluates each child node in the AST
  for (const statement of program.body) {
    lastEvaluated = evaluate(statement, env);
  }

  return lastEvaluated;
}

// in the case that either left or right is another binary expression
// it will continue to recursively call itself until it gets down to the base case where both left and right are numeric literals
// and bubble back up to get the numeric values of the original binary expressions
function evaluateBinary(binary, env) {
  const left = evaluate(binary.left, env);
  const right = evaluate(binary.right, env);
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

function evaluateIdentifier(identifier, env) {
  const val = env.get(identifier.symbol);
  return val;
}

function evaluate(ast, env) {
  switch (ast.type) {
    case "NumericLiteral":
      return { type: "number", value: ast.value };

    case "Identifier":
      return evaluateIdentifier(ast, env);

    case "BinaryExpr":
      return evaluateBinary(ast, env);

    case "Program":
      return evaluateProgram(ast, env);

    default:
      console.error(`Unrecognized AST Node: ${ast}`);
      process.exit(1);
  }
}

module.exports = evaluate;
