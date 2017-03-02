'use strict'

const ci = require('case-insensitive')
const getClassChain = require('class-chain')
const isBuffer = require('is-buffer')
const isGeneratorFunction = require('is-generator-function')
const isPlainObject = require('is-plain-object')
const removePrefix = require('remove-prefix')
const whitespaceRegex = require('whitespace-regex')()

const complexTests = ['a', 'an']

module.exports = isit

function isit (types, value) {
  types = prepareTypesArg(types)
  if (!types.length) return false
  for (let type of types) {
    type += ''

    let negated = false
    type = removePrefix(type, ['non-', '!'], p => { negated = !!p })

    if (type === 'arguments') type = 'args'

    let result
    if (isit.hasOwnProperty(type) && !complexTests.includes(type)) {
      result = isit[type](value)
    } else {
      result = isit.a(type, value)
    }

    if (negated) result = !result

    if (!result) return false
  }
  return true
}

// ********** OBJECT CLASS INSTANCES ********** //

isit.a = isit.an = function (classes, value) {
  classes = prepareTypesArg(classes)
  if (!classes.length) return false

  let valueClasses

  for (let cls of classes) {
    if (typeof cls === 'function') {
      if (value instanceof cls) return true
    } else {
      if (cls instanceof String) {
        cls += ''
      }
      if (typeof valueClasses === 'undefined') {
        valueClasses = ci(getClassChain.names(value))
      }
      if (typeof cls === 'string' && valueClasses.includes(cls)) {
        return true
      }
    }
  }
  return false
}

// ********** NIL VALUES ********** //

isit.undefined = isit.undef = function (value) {
  return typeof value === 'undefined'
}

isit.null = function (value) {
  return value === null
}

isit.nil = function (value) {
  // Only null and undefined loosely equate to null
  return value == null // eslint-disable-line no-eq-null
}

// ********** PRIMITIVES & SCALARS ********** //

isit.primitive = function (value) {
  return isit.nil(value) || isit.scalar(value)
}

isit.scalar = function (value) {
  return !isit.nil(value) && !isit.objectbased(value)
}

// ********** BOOLEANS ********** //

isit.boolean = isit.bool = function (value) {
  return typeof value === 'boolean'
}

isit.boolish = function (value) {
  return isit.bool(value) ||
    isit.a(Boolean, value) ||
    (isit.stringish(value) && ['true', 'false'].includes(value.toLowerCase()))
}

isit.true = function (value) {
  return value === true ||
    (isit.stringish(value) && value.toLowerCase() === 'true') ||
    (isit.a(Boolean, value) && value.valueOf() === true)
}

isit.truthy = function (value) {
  return value && !isit.false(value)
}

isit.false = function (value) {
  return value === false ||
    (isit.stringish(value) && value.toLowerCase() === 'false') ||
    (isit.a(Boolean, value) && value.valueOf() === false)
}

isit.falsey = function (value) {
  return !value || isit.false(value)
}

// ********** EMPTY/BLANK VALUES ********** //

isit.empty = function (value) {
  if (isit.nil(value) || isit.nan(value)) {
    return true
  } else if (isit.function(value)) {
    // We need to check for functions here, or else a function with
    // no parameters will trigger the `value.length === 0` test.
    return false
  } else if (typeof value.length !== 'undefined') {
    return value.length === 0
  } else if (typeof value.size !== 'undefined') {
    return value.size === 0
  } else if (isit.plain(value)) {
    return Object.keys(value).length === 0
  }
  return false
}

isit.blank = function (value) {
  return isit.empty(value) || (isit.stringish(value) && whitespaceRegex.test(String(value)))
}

// ********** FUNCTIONS ********** //

isit.function = function (value) {
  return typeof value === 'function'
}

isit.generator = function (value) {
  return isGeneratorFunction(value)
}

// ********** NUMBERS ********** //

isit.number = function (value) {
  return typeof value === 'number' && !isit.nan(value)
}

isit.numberish = function (value) {
  return isit.number(value) || (isit.a(Number, value) && !isit.nan(value))
}

isit.numeric = function (value) {
  return isit.numberish(value) || (isit.stringish(value) && !isNaN(String(value)))
}

isit.nan = function (value) {
  if (value instanceof Number) value = Number(value)
  return Number.isNaN(value)
}

isit.finite = function (value) {
  return isit.numeric(value) && isFinite(value)
}

isit.infinity = function (value) {
  return isit.numeric(value) && !isFinite(value)
}

isit.integer = isit.int = function (value) {
  return isit.numeric(value) && Number.isInteger(Number(value))
}

isit.float = function (value) {
  return isit.finite(value) && !Number.isInteger(Number(value))
}

isit.positive = function (value) {
  if (!isit.numeric(value)) return false
  value = Number(value)
  return value > 0 || Object.is(value, 0)
}

isit.negative = function (value) {
  if (!isit.numeric(value)) return false
  value = Number(value)
  return value < 0 || Object.is(value, -0)
}

// ********** OBJECTS & ARRAYS ********** //

isit.objectbased = function (value) {
  return isit.object(value) || isit.function(value)
}

isit.object = function (value) {
  return typeof value === 'object' && value !== null
}

isit.plain = function (value) {
  return isPlainObject(value)
}

isit.array = function (value) {
  return Array.isArray(value)
}

isit.args = function (value) {
  return typeof value === 'object' &&
    Object.prototype.toString.call(value) === '[object Arguments]'
}

isit.buffer = function (value) {
  return isBuffer(value)
}

isit.collection = function (value) {
  return isit.a([
    Map,
    Set,
    WeakMap,
    WeakSet,
  ], value)
}

isit.iterable = function (value) {
  return !isit.nil(value) && typeof value[Symbol.iterator] === 'function'
}

isit.typedarray = function (value) {
  return isit.a([
    Int8Array,
    Uint8Array,
    Uint8ClampedArray,
    Int16Array,
    Uint16Array,
    Int32Array,
    Uint32Array,
    Float32Array,
    Float64Array,
  ], value)
}

// ********** STRINGS ********** //

isit.string = function (value) {
  return typeof value === 'string'
}

isit.stringish = function (value) {
  return isit.string(value) || isit.a(String, value)
}

// ********** SYMBOL ********** //

isit.symbol = function (value) {
  return typeof value === 'symbol'
}

// ********** UTILITY FUNCTIONS ********** //

function prepareTypesArg (types) {
  if (Array.isArray(types)) {
    return types
  }
  if (types instanceof String) {
    types += ''
  }
  if (typeof types === 'string') {
    return types.trim().split(' ').filter(Boolean)
  }
  return [types]
}
