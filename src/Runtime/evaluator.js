function evaluateProgram(program) {
  let lastEvaluated = { type: "null", value: "null" };

  for (const statement of program.body) {
    lastEvaluated = evaluate(statement);
  }

  return lastEvaluated;
}

function evaluateBinary(binary) {
  const left = evaluate(binary.left);
  const right = evaluate(binary.right);

  if (left.type === "number" && right.type === "number") {
    return evaluateNumericBinary(left, right, binary.operator);
  } else {
    return { type: "null", value: "null" };
  }
}

function evaluateNumericBinary(left, right, operator) {
  let res = 0;
  if (operator === "+") {
    result = left.value + right.value;
  } else if (operator === "-") {
    result = left.value - right.value;
  } else if (operator === "*") {
    result = left.value * right.value;
  } else if (operator === "/") {
    result = left.value / right.value;
  } else if (operator === "%") {
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
      console.error("Unrecognized AST Node");
      process.exit(1);
  }
}

module.exports = evaluate;
