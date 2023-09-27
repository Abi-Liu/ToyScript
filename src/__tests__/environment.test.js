const Environment = require("../Runtime/environment");

describe("Environment tests", () => {
  let env;
  beforeEach(() => {
    env = new Environment();
    // creating true false and null values inside the global runtime
    env.declareVar("true", { value: true, type: "boolean" }, true);
    env.declareVar("false", { value: false, type: "boolean" }, true);
    env.declareVar("null", { value: null, type: "null" }, true);

    // creating a native print function
    env.declareVar("print", {
      type: "NativeFunction",
      call: (args, env) => {
        console.log(...args);
        return { type: "null", value: null };
      },
    });
  });

  test("testing scope", () => {
    const scope = new Environment(env);
    expect(scope.parent).toEqual(env);
  });

  test("declaring a constant number variable", () => {
    env.declareVar("x", { value: 34, type: "number" }, true);
    expect(env.variables.has("x")).toBe(true);
    expect(env.constants.has("x")).toBe(true);
  });

  test("declaring a non constant string variable", () => {
    env.declareVar("x", { value: "hello", type: "string" }, false);
    expect(env.variables.has("x")).toBe(true);
    expect(env.constants.has("x")).toBe(false);
  });

  test("reassigning a constant variable", () => {
    env.declareVar("x", { value: 34, type: "number" }, true);
    expect(() => {
      env.assignVar(x, { value: 55, type: "number" });
    }).toThrowError("x is not defined");
  });

  test("reassigning a non constant variable", () => {
    env.declareVar("x", { value: 34, type: "number" }, false);
    expect(env.variables.get("x")).toEqual({ value: 34, type: "number" });

    env.assignVar("x", { value: 55, type: "number" });
    expect(env.variables.get("x")).toEqual({ value: 55, type: "number" });
  });

  test("lookup defined variable", () => {
    env.declareVar("x", { value: 34, type: "number" }, false);

    expect(env.lookup("x")).toEqual(env);
  });

  test("lookup undefined variable", () => {
    expect(() => {
      env.lookup("x");
    }).toThrowError();
  });

  test("lookup variable in an outer scope", () => {
    env.declareVar("x", { value: 34, type: "number" }, false);
    const scope = new Environment(env);

    expect(scope.lookup("x")).toEqual(env);
  });

  test("lookup variable in an inner scope", () => {
    const scope = new Environment(env);
    scope.declareVar("x", { value: 34, type: "number" }, false);
    expect(() => {
      env.lookup("x");
    }).toThrowError();
  });

  test("get variable", () => {
    env.declareVar("x", { value: 34, type: "number" }, false);
    expect(env.get("x")).toEqual({ type: "number", value: 34 });
  });
});
