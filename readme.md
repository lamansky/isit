# isit

A [Node.js](https://nodejs.org/) module that tests a value’s type against a string like `'positive integer'` or `'non-empty map'`.

## Installation

```bash
npm install isit --save
```

## Usage

When calling `isit()`, the first argument is a space-separated string of type tests, and the second argument is the value to be tested. `isit()` returns true only if all tests pass.

```javascript
isit('non-empty array', [1, 2, 3]) // true
isit('empty map', new Map()) // true
isit('positive integer', 1) // true
```

Available tests are listed in the “Type Tests” section below. Anything that does not match one of the available tests will be considered a class name (example: `map` in the above code block).

### Negation

A test can be individually negated by prefixing it with `non-` or `!`, as in:

```javascript
isit('non-empty array', [1, 2, 3]) // true
isit('array !empty', [1, 2, 3]) // true
isit('empty non-array', '') // true
```

### Individual Test Functions

All tests are also available as member functions of `isit`, allowing you to run a single test like so:

```javascript
isit.array([]) // true
isit.string('test') // true
```

## Type Tests

Here is the complete list:

* `arguments` / `args`
* `array`
* `blank`
* `boolean` / `bool`
* `boolish`
* `buffer`
* `collection`
* `empty`
* `false`
* `falsey`
* `float`
* `finite`
* `function`
* `generator`
* `infinity`
* `integer` / `int`
* `iterable`
* `nan`
* `negative`
* `nil`
* `null`
* `number`
* `numberish`
* `numeric`
* `object`
* `objectbased`
* `plain`
* `positive`
* `primitive`
* `scalar`
* `string`
* `stringish`
* `symbol`
* `true`
* `truthy`
* `typedarray`
* `undefined` / `undef`

### Undefined & Null

| Value:      | `undefined`<br>`undef` | `null` | `nil` |
| ----------- | :--------------------: | :----: | :---: |
| `undefined` | ✔                      |        | ✔     |
| `null`      |                        | ✔      | ✔     |

### Primitives & Scalars

| Value Type: | `primitive` | `scalar` |
| ----------- | :---------: | :------: |
| Undefined   | ✔           |          |
| Null        | ✔           |          |
| Boolean     | ✔           | ✔        |
| Number      | ✔           | ✔        |
| String      | ✔           | ✔        |
| Symbol      | ✔           | ✔        |
| Object      |             |          |
| Function    |             |          ||

### Booleans

| Value:               | `boolean`<br>`bool` | `boolish` |
| -------------------- | :-----------------: | :-------: |
| `true`               | ✔                   | ✔         |
| `false`              | ✔                   | ✔         |
| `'true'` string      |                     | ✔         |
| `'false'` string     |                     | ✔         |
| `new Boolean(true)`  |                     | ✔         |
| `new Boolean(false)` |                     | ✔         |

| Value:              | `true` | `truthy` |
| ------------------- | :----: | :------: |
| `true`              | ✔      | ✔        |
| `new Boolean(true)` | ✔      | ✔        |
| `'true'` string     | ✔      | ✔        |
| `'false'` string    |        |          |
| `1`                 |        | ✔        |
| `'test'`            |        | ✔        |
| `[]`                |        | ✔        |

| Value:               | `false` | `falsey` |
| -------------------- | :-----: | :------: |
| `false`              | ✔       | ✔        |
| `new Boolean(false)` | ✔       | ✔        |
| `'false'` string     | ✔       | ✔        |
| `0`                  |         | ✔        |
| `''`                 |         | ✔        |

### Empty Values

Every empty-checker out there assesses “emptiness” a bit differently. For our purposes, an empty value is one which contains no useful information except the absence of a value. Therefore, unlike many similar functions, the `empty` test does _not_ consider `0`, `false`, or zero-parameter functions to be “empty,” because these can often be intended as actual values.

| Value:        | `empty` |
| ------------- | :-----: |
| `undefined`   | ✔       |
| `null`        | ✔       |
| `NaN`         | ✔       |
| `0`           |         |
| `false`       |         |
| `''`          | ✔       |
| `{}`          | ✔       |
| `[]`          | ✔       |
| `() => {}`    |         |
| `new Error()` |         |
| `new Map()`   | ✔       |
| `new Set()`   | ✔       |

#### Blank Values

The `blank` test is the same as `empty` except it also returns `true` for strings that consist only of whitespace.

### Functions

| Value:              | `function` | `generator` |
| ------------------- | :--------: | :---------: |
| `function () {}`    | ✔          |             |
| `() => {}`          | ✔          |             |
| `function* () {}`   | ✔          | ✔           |

### Numbers

| Value:          | `number` | `numberish` | `numeric` |
| --------------- | :------: | :---------: | :-------: |
| `0`             | ✔        | ✔           | ✔         |
| `1.23`          | ✔        | ✔           | ✔         |
| `new Number(1)` |          | ✔           | ✔         |
| `'1'`           |          |             | ✔         |
| `'1e3'`         |          |             | ✔         |
| `NaN`           |          |             |           ||

| Value:          | `positive` | `negative` |
| --------------- | :--------: | :--------: |
| `Infinity`      | ✔          |            |
| `123.45`        | ✔          |            |
| `0`             | ✔          |            |
| `-0`            |            | ✔          |
| `-123.45`       |            | ✔          |
| `-Infinity`     |            | ✔          |

JavaScript considers the number zero to be either positively or negatively signed; therefore, `positive` reports `true` for `0`. If you want to exclude zero, consider using a simple `x>0` test instead.

More Number Tests:
* `nan`
* `integer` / `int`
* `float`
* `finite`
* `infinity`

### Objects

Although functions are technically objects in JavaScript, they are often considered a separate category because the `typeof` operator gives them their own type. Use `objectbased` if you want to include functions.

| Value:       | `object` | `objectbased` |
| ------------ | :------: | :-----------: |
| `{}`         | ✔        | ✔             |
| `() => {}`   |          | ✔             |

| Value:       | `object` | `plain` | `array` |
| ------------ | :------: | :-----: | :-----: |
| `new Date()` | ✔        |         |         |
| `{}`         | ✔        | ✔       |         |
| `[]`         | ✔        |         | ✔       |

The `object` test returns `true` for arrays, because arrays are objects in JavaScript. If you want to exclude arrays, test against `'non-array object'` instead.

#### Arguments

`arguments` or `args` returns true if the value is an Arguments object.

#### Buffers

The `buffer` test returns true if the value is a Node.js or Browserify Buffer.

#### Collections

The `collection` test returns true if the value is an instance of one of:
* Map
* Set
* WeakMap
* WeakSet

#### Iterables

The `iterable` test returns true if [`for...of`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Statements/for...of) can be used to iterate through the value.

#### Typed Arrays

The `typedarray` test returns true if the value is an instance of one of:
* Int8Array
* Uint8Array
* Uint8ClampedArray
* Int16Array
* Uint16Array
* Int32Array
* Uint32Array
* Float32Array
* Float64Array

### Strings

| Value:               | `string` | `stringish` |
| -------------------- | :------: | :---------: |
| `''`                 | ✔        | ✔           |
| `'test'`             | ✔        | ✔           |
| `new String('test')` |          | ✔           |

### Symbols

The `symbol` test returns true if the value is a symbol.

## Class Testing

You can use `isit.a` or `isit.an` to see if an object is an instance of a given class.

You can provide the class itself or the class name as a case-insensitive string.

```javascript
isit.a(Date, new Date()) // true
isit.a('date', new Date()) // true

isit.an(Error, new Error()) // true
isit.an('error', new Error()) // true

// Returns true because TypeError extends Error
isit.an(Error, new TypeError()) // true
```

You can also check if a given value is an instance of any one of a list of classes:

```javascript
isit.a([TypeError, ReferenceError], new TypeError()) // true
isit.a('TypeError ReferenceError', new TypeError()) // true
```

## Advanced Usage

### Adding Tests

You can add new tests by monkey-patching them as member functions of `isit`. For example:

```javascript
const isit = require('isit')
isit.zero = value => value === 0
isit('negative zero', -0) // true
isit('non-zero integer', 1) // true
```
