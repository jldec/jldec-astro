---
title: "TypeScript and JavaScript keywords"
date: 2025-05-22
layout: BlogPostLayout
splash:
  image: images/boston.webp
draft: true
---

# TypeScript and JavaScript keywords

While learning TypeScript -- an ongoing process -- I sometimes struggle to find the canonical docs in the Handbook. So today, I [asked grok](https://grok.com/share/bGVnYWN5_127524d5-f310-452e-9245-dcf9f0452ca0) to generate a list of TypeScript and JavaScript keywords and links to their docs.

> Thank you all MDN and TypeScript contributors. 🙏

## TypeScript
| Keyword | Description | Docs |
|---------|-------------|----------------------------|
| `any` | Represents any type, bypassing type checking | [any](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any) |
| `as` | Performs type assertion or const assertion | [type assertions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions) |
| `asserts` | Used in type predicates to assert a condition | [assertion functions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions) |
| `bigint` | Represents large integers | [bigint](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#bigint) |
| `boolean` | Represents true or false values | [boolean](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#boolean) |
| `declare` | Specifies ambient declarations | [ambient declarations](https://www.typescriptlang.org/docs/handbook/2/modules.html#ambient-modules) |
| `enum` | Defines a set of named constants | [enums](https://www.typescriptlang.org/docs/handbook/enums.html) |
| `extends` | Extending types. cf JavaScript extends | [extends interface](https://www.typescriptlang.org/docs/handbook/2/objects.html#extending-types) |
| `infer` | Infers a type variable in conditional types | [infer types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#infer-from-conditional-types) |
| `is` | Used in type predicates | [type predicates](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates) |
| `keyof` | Creates a type from an object’s keys | [keyof types](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html) |
| `module` | Declares a module (similar to namespace) | [modules](https://www.typescriptlang.org/docs/handbook/2/modules.html) |
| `namespace` | Organizes code in a named scope | [namespaces](https://www.typescriptlang.org/docs/handbook/namespaces.html) |
| `never` | Represents values that never occur | [never](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#never) |
| `number` | Represents numeric values | [number](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#number) |
| `object` | Represents non-primitive types | [object](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#object) |
| `out` | Specifies variance in generic types | [variance annotations](https://www.typescriptlang.org/docs/handbook/2/generics.html#variance-annotations) |
| `override` | Ensures a method overrides a base class method | [override](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-3.html#override-and-the---noimplicitoverride-flag) |
| `readonly` | Prevents reassignment of properties | [readonly](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#readonly) |
| `satisfies` | Ensures a value matches a type without casting | [satisfies operator](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator) |
| `string` | Represents string values | [string](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#string) |
| `symbol` | Represents unique identifiers | [symbol](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#symbol) |
| `type` | Defines a type alias | [type aliases](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases) |
| `undefined` | Represents an undefined value | [undefined](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#undefined) |
| `unique` | Used with symbols for unique types | [unique symbol](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#unique-symbol) |
| `unknown` | Represents values of unknown type | [unknown](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#unknown) |

## JavaScript
| Keyword | Description | Docs |
|---------|-------------|----------------------------|
| `async` | Declares an asynchronous function | [async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) |
| `await` | Pauses async function until a promise resolves | [await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) |
| `break` | Exits a loop or switch statement | [break](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/break) |
| `case` | Defines a case in a switch statement | [switch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch) |
| `catch` | Handles exceptions in a try-catch block | [try...catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) |
| `class` | Declares a class | [class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) |
| `const` | Declares a block-scoped, read-only variable | [const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) |
| `continue` | Skips to the next iteration of a loop | [continue](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/continue) |
| `debugger` | Invokes a debugging breakpoint | [debugger](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/debugger) |
| `default` | Specifies the default case in a switch or export | [switch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch) |
| `delete` | Deletes a property from an object | [delete](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/delete) |
| `do` | Starts a do-while loop | [do...while](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/do...while) |
| `else` | Specifies alternative execution in an if statement | [if...else](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) |
| `export` | Exports a module member | [export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) |
| `extends` | Indicates inheritance in classes | [extends](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/extends) |
| `false` | Boolean literal for false | [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) |
| `finally` | Executes after a try-catch block | [try...catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) |
| `for` | Creates a loop (for, for...of, for...in) | [for](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for) |
| `function` | Declares a function | [function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function) |
| `get` | Defines a getter method | [get](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get) |
| `if` | Conditional statement | [if...else](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) |
| `implements` | Reserved in JavaScript; specifies interface implementation in TypeScript | [implements](https://www.typescriptlang.org/docs/handbook/2/classes.html#implements-clauses) |
| `import` | Imports module members | [import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) |
| `in` | Checks if a property exists in an object | [in](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/in) |
| `instanceof` | Tests if an object is an instance of a constructor | [instanceof](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof) |
| `interface` | Reserved in JavaScript; defines type contracts in TypeScript | [interface](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces) |
| `let` | Declares a block-scoped variable | [let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) |
| `new` | Creates an instance of a constructor | [new](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new) |
| `null` | Represents the absence of a value | [null](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null) |
| `package` | Reserved in JavaScript; not used in TypeScript | [strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode) |
| `private` | Reserved in JavaScript; restricts access in TypeScript | [private](https://www.typescriptlang.org/docs/handbook/2/classes.html#private) |
| `protected` | Reserved in JavaScript; allows subclass access in TypeScript | [protected](https://www.typescriptlang.org/docs/handbook/2/classes.html#protected) |
| `public` | Reserved in JavaScript; allows unrestricted access in TypeScript | [public](https://www.typescriptlang.org/docs/handbook/2/classes.html#public) |
| `return` | Exits a function and returns a value | [return](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/return) |
| `set` | Defines a setter method | [set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set) |
| `static` | Defines static class members | [static](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static) |
| `super` | Refers to the parent class | [super](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super) |
| `switch` | Evaluates an expression against multiple cases | [switch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch) |
| `this` | Refers to the current object context | [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) |
| `throw` | Throws an exception | [throw](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw) |
| `true` | Boolean literal for true | [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) |
| `try` | Attempts execution that may throw an error | [try...catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) |
| `typeof` | Returns the type of a value | [typeof](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof) |
| `var` | Declares a variable (function or global scope) | [var](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var) |
| `void` | Evaluates an expression without returning a value | [void](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/void) |
| `while` | Creates a while loop | [while](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/while) |
| `with` | Extends the scope chain (deprecated) | [with](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/with) |
| `yield` | Pauses and returns a value from a generator | [yield](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/yield) |
