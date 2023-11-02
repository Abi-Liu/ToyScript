# ToyScript

A mini programming language I'm making from scratch using JavaScript, implementing the basic features of a programming language: closures, variable assignment and declaration, function declaration and calls, numeric, boolean, null, string, and object value types, and more!

See my Medium article on my process here: https://medium.com/@abiliu018/how-i-created-my-own-programming-language-from-scratch-9b99fa0a802b

## Demo
Here is a quick demo of the language in action using a recursive `fizzbuzz` function.

![ToyScript Demo](Demo/demo.gif)

## Disclaimer

The goal of this project is not to create the next big programming language or a super-fast interpreter. Instead, the goal is to deepen my fundamental understanding of how programming languages work by building my own version of one.

## How to use

Although NPM is not required to use the language, if you want to run the unit tests, you will need to have NPM installed. If you don't, you can do so by entering this command in your terminal

- npm
  ```sh
  npm install npm@latest -g
  ```

To get started on your machine,

1. Clone the repo
   ```sh
   git clone https://github.com/Abi-Liu/ToyScript.git
   ```
2. Install NPM packages to run unit tests
   ```sh
   npm install
   ```
To run your own code, simply navigate into the src directory, modify the contents in the test.txt file and run the command and you should see the outputs in the terminal!

```sh
node main.js
```

## Running tests

To run the entire test suite you can run the following command in the terminal:

```sh
npm test
```

If you only want to run a specific test file, for example the evaluator tests, you can do so with the command:

```sh
npm test evaluator.test.js
```

## Supported Syntax

1. Numbers, Strings, Booleans, Objects, and Null

```javascript
12 // NumericLiteral
'Hello' || "Hello" // StringLiteral
true || false // Boolean
{one: 1, two: "two"} // ObjectLiteral
null // Null
```

2. Variable, a.k.a. Identifier

```javascript
foo
```

3. Binary Operators

```javascript
+, -, *, /, %
```

4. Comparison Operators

```javascript
==, !=, <, <=, >, >=
```

5. Logical Operators

```javascript
&&, ||
```

5. Unary Operators

**Note**: There is currently no `-` unary operator. If you would like to reverse the sign of a number, just multiply it by -1

```javascript
!
```

6. Conditional Statement

```javascript
if(conditional1){
    blockStatement
} elseif (conditional2) {
    blockStatement
} else {
    blockStatement
}
```

7. Function Declaration

**Note**: There is no return statement in this language. The interpreter will automatically return the last statement in the function body

```javascript
fn add(x,y){
    x + y
}
```

8. Call Expression

```javascript
add(1,2)
```

9. Variable Declaration

**Note** This language does support both `let` and `const` declaration and behaves much like Javascript. If you want to declare an uninitialized value, you must include a semicolon after the identifier.

```javascript
const foo = 12
let bar = 24
bar = 1
let foobar;
```

10. Native Functions

**Note**: So far the only native function this language has is the print function, which behaves like `console.log()` in Javascript

```javascript
print(10)
```
