const repl = require("repl");
const Parser = require("./Parsing/parser");
const evaluate = require("./Runtime/evaluator");
const Environment = require("./Runtime/environment");
const fs = require("fs");

const env = new Environment(null);
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

const parser = new Parser();

// repl.start({
//   prompt: ">",
//   eval: function (input) {
//     let program = parser.produceAST(input);
//     const result = evaluate(program, env);
//     console.log(result);
//   },
// });

// Read the content of the text file
const filePath = "./test.txt";
const fileContent = fs.readFileSync(filePath, "utf-8");

// Parse and evaluate the content of the text file
const program = parser.produceAST(fileContent);
const result = evaluate(program, env);
