class Environment {
  constructor(parent) {
    this.variables = new Map();
    this.constants = new Set();
    this.parent = parent;
  }

  // method to declare a new variable.
  // Checks to make sure variable isn't already defined in the current scope
  declareVar(variable, value, constant) {
    if (this.variables.has(variable)) {
      throw `Cannot redeclare block scoped variable ${variable}`;
    } else {
      this.variables.set(variable, value);
      if (constant) {
        this.constants.add(variable);
      }
      return value;
    }
  }

  assignVar(variable, value) {
    const env = this.lookup(variable);
    // console.log(variable, value);
    // cannot reassign constant var
    if (env.constants.has(variable)) {
      throw "Cannot reassign a constant variable: " + variable;
    }
    env.variables.set(variable, value);
    return value;
  }

  // checks if the current scope has the variable
  // if not, then it will recursively check for the variable up the parent chain and throw an error if it is not found.
  lookup(variable) {
    if (this.variables.has(variable)) {
      return this;
    }

    if (this.parent == undefined) {
      throw `Undefined variable: ${variable}`;
    }

    return this.parent.lookup(variable);
  }

  get(variable) {
    const env = this.lookup(variable);
    return env.variables.get(variable);
  }
}

module.exports = Environment;
