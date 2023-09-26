const Environment = require("./environment");

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
    res = left.value / right.value;
  } else if (operator === "%") {
    if (right.value === 0) {
      console.error("Cannot divide by 0");
      process.exit(1);
    }
    res = left.value % right.value;
  }

  return { value: res, type: "number" };
}

function evaluateIdentifier(identifier, env) {
  const val = env.get(identifier.symbol);
  return val;
}

function evaluateVarDeclaration(variable, env) {
  const value = variable.value
    ? evaluate(variable.value, env)
    : { type: "null", value: null };

  return env.declareVar(variable.identifier, value, variable.constant);
}

function evaluateAssignment(variable, env) {
  if (variable.assignee.type !== "Identifier") {
    throw "Invalid assignment indentifier variable";
  }
  const value = evaluate(variable.value, env);
  return env.assignVar(variable.assignee.symbol, value);
}

function evaluateObject(obj, env) {
  const object = { type: "object", properties: new Map() };
  for (const { key, value } of obj.properties) {
    const runtimeVal = evaluate(value, env);
    object.properties.set(key, runtimeVal);
  }
  return object;
}

function evaluateMember(member, env) {
  // recursively go down the members if there are nested objects => x.one.two
  let objectValue = evaluate(member.object, env);

  // Ensure that the object is of type 'object'
  // i.e let x = 4;
  // x.one
  // typeof x !== 'object' thus we throw an error message
  if (objectValue.type !== "object") {
    console.error(`Cannot access member of non-object: ${objectValue.type}`);
  }
  // Get the member name from the member expression (e.g., 'two' in x.one.two)
  const memberName = member.property.symbol;

  // Check if the member exists in the object's properties
  if (!objectValue.properties.has(memberName)) {
    console.error(`Member not found: ${memberName}`);
    process.exit(1);
  }

  // Retrieve and return the member's value
  return objectValue.properties.get(memberName);
}

function evaluateFunctionDeclaration(declaration, env) {
  const fn = {
    type: "FunctionDeclaration",
    name: declaration.name,
    parameters: declaration.parameters,
    body: declaration.body,
    env,
  };

  env.declareVar(declaration.name, fn, true);
}

function evaluateCallExpr(expr, env) {
  // map all the arguments to the value of the arguments
  const args = expr.args.map((arg) => evaluate(arg, env));
  const fn = evaluate(expr.caller, env);

  // check for native functions
  if (fn.type === "NativeFunction") {
    const result = fn.call(args, env);
    return result;
  }

  if (fn.type === "FunctionDeclaration") {
    // here is where we create a new scope for the function run time. it's parent env is the scope in which it was declared in.
    const scope = new Environment(fn.env);
    // for loop to declare the arguments as variables in the new scope
    for (let i = 0; i < fn.parameters.length; i++) {
      const name = fn.parameters[i];
      scope.declareVar(name.symbol, args[i], false);
    }

    // in case function body is empty
    let result = { type: "null", value: "null" };
    // evaluates the body line by line
    for (const stmt of fn.body) {
      result = evaluate(stmt, scope);
    }
    // the final line in the body is what will be returned.
    return result;
  }

  // throw `Cannot call a value that is not a function ${fn}`;
}

function evaluate(ast, env) {
  switch (ast.type) {
    case "NumericLiteral":
      return { type: "number", value: ast.value };

    case "Identifier":
      return evaluateIdentifier(ast, env);

    case "BinaryExpr":
      return evaluateBinary(ast, env);

    case "VariableDeclaration":
      return evaluateVarDeclaration(ast, env);

    case "ObjectLiteral":
      return evaluateObject(ast, env);

    case "MemberExpr":
      return evaluateMember(ast, env);

    case "AssignmentExpr":
      return evaluateAssignment(ast, env);

    case "FunctionDeclaration":
      return evaluateFunctionDeclaration(ast, env);

    case "CallExpr":
      return evaluateCallExpr(ast, env);

    case "Program":
      return evaluateProgram(ast, env);

    default:
      console.error(`Unrecognized AST Node: ${ast}`);
      process.exit(1);
  }
}

module.exports = evaluate;
