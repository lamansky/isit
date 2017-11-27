'use strict'

const assert = require('assert')
const isit = require('.')

const now = new Date()

describe('isit', function () {
  it('should accept string with single test', function () {
    assert(isit('array', []))
    assert(!isit('array', {}))
  })

  it('should accept string with multiple tests', function () {
    assert(isit('empty array', []))
    assert(!isit('empty array', [1]))
  })

  it('should return a function if there is no second argument', function () {
    const isArray = isit('array')
    assert.strictEqual(typeof isArray, 'function')
    assert(isArray([]))
    assert(!isArray({}))
  })

  it('should support an undefined second argument', function () {
    assert.strictEqual(isit('undefined', undefined), true) // eslint-disable-line no-undefined
  })

  for (const prefix of ['non-', '!']) {
    it(`should accept string with a test negated with \`${prefix}\``, function () {
      assert(isit(prefix + 'empty array', [1]))
      assert(!isit(prefix + 'empty array', []))
    })
  }

  it('should assume unknown tests are class names', function () {
    assert(isit('map', new Map()))
    assert(!isit('map', ''))
  })

  it('should support negated class names', function () {
    assert(isit('non-map', new Set()))
    assert(!isit('non-map', new Map()))
  })

  it('should reroute "arguments" test to "args" method', function () {
    // "arguments" is not a valid identifier in JavaScript because it's reserved.
    // Therefore, an `isit.arguments()` method is not possible.
    assert(isit('arguments', arguments))
  })

  describe('#a()', function () {
    it('should return true if value is instance of a class', function () {
      assert(isit.a(Date, now))
    })

    it('should return false if value is not instance of a class', function () {
      assert(!isit.a(String, now))
    })

    it('should return true if value is instance of a class by name', function () {
      assert(isit.a('date', now))
    })

    it('should return true if value is instance of a class by name', function () {
      assert(!isit.a('regexp', now))
    })

    it('should return true if value is instance of a class by String-wrapped name', function () {
      assert(isit.a(new String('date'), now)) // eslint-disable-line no-new-wrappers
    })

    it('should return true if value is instance of one of the classes', function () {
      assert(isit.a([Error, Date], now))
    })

    it('should return true if value is instance of one of the classes by name', function () {
      assert(isit.a('error date', now))
    })
  })

  describe('#an()', function () {
    it('should return true if value is instance of a class', function () {
      assert(isit.an(Error, new Error()))
    })
  })

  describe('#undefined()', function () {
    it('should return true if value is undefined', function () {
      assert(isit.undefined(undefined)) // eslint-disable-line no-undefined
    })

    it('should return false if value is not undefined', function () {
      assert(!isit.undefined(null))
    })
  })

  describe('#undef()', function () {
    it('should return true if value is undefined', function () {
      assert(isit.undef(undefined)) // eslint-disable-line no-undefined
    })

    it('should return false if value is not undefined', function () {
      assert(!isit.undef(null))
    })
  })

  describe('#null()', function () {
    it('should return true if value is null', function () {
      assert(isit.null(null))
    })

    it('should return false if value is not null', function () {
      assert(!isit.null(undefined)) // eslint-disable-line no-undefined
    })
  })

  describe('#nil()', function () {
    it('should return true if value is undefined', function () {
      assert(isit.nil(undefined)) // eslint-disable-line no-undefined
    })

    it('should return true if value is null', function () {
      assert(isit.nil(null))
    })

    it('should return false if value is neither null nor undefined', function () {
      assert(!isit.nil(false))
      assert(!isit.nil(0))
      assert(!isit.nil(''))
    })
  })

  describe('#primitive()', function () {
    it('should return true if value is undefined', function () {
      assert(isit.primitive(undefined)) // eslint-disable-line no-undefined
    })

    it('should return true if value is null', function () {
      assert(isit.primitive(null))
    })

    it('should return true if value is string', function () {
      assert(isit.primitive('string'))
    })

    it('should return true if value is number', function () {
      assert(isit.primitive(0))
    })

    it('should return true if value is boolean', function () {
      assert(isit.primitive(true))
    })

    it('should return true if value is symbol', function () {
      assert(isit.primitive(Symbol.iterator))
    })

    it('should return false if value is an object', function () {
      assert(!isit.primitive({}))
    })

    it('should return false if value is a function', function () {
      assert(!isit.primitive(() => {}))
    })
  })

  describe('#scalar()', function () {
    it('should return false if value is undefined', function () {
      assert(!isit.scalar(undefined)) // eslint-disable-line no-undefined
    })

    it('should return false if value is null', function () {
      assert(!isit.scalar(null))
    })

    it('should return true if value is string', function () {
      assert(isit.scalar('string'))
    })

    it('should return false if value is String object', function () {
      assert(!isit.scalar(new String('string'))) // eslint-disable-line no-new-wrappers
    })

    it('should return true if value is number', function () {
      assert(isit.scalar(0))
    })

    it('should return true if value is boolean', function () {
      assert(isit.scalar(true))
    })

    it('should return true if value is symbol', function () {
      assert(isit.scalar(Symbol.iterator))
    })

    it('should return false if value is an object', function () {
      assert(!isit.scalar({}))
    })

    it('should return false if value is a function', function () {
      assert(!isit.scalar(() => {}))
    })
  })

  describe('#boolean()', function () {
    it('should return true if value is boolean', function () {
      assert(isit.boolean(false))
    })

    it('should return false if value is a Boolean object', function () {
      assert(!isit.boolean(new Boolean(true))) // eslint-disable-line no-new-wrappers
    })

    it('should return false if value is not boolean', function () {
      assert(!isit.boolean(1))
      assert(!isit.boolean('true'))
      assert(!isit.boolean(null))
    })
  })

  describe('#bool()', function () {
    it('should return true if value is boolean', function () {
      assert(isit.bool(false))
    })
  })

  describe('#boolish()', function () {
    it('should return true if value is boolean', function () {
      assert(isit.boolish(false))
    })

    it('should return true if value is a Boolean object', function () {
      assert(isit.boolish(new Boolean(true))) // eslint-disable-line no-new-wrappers
    })

    it('should return true if value is "true"', function () {
      assert(isit.boolish('true'))
    })

    it('should return true if value is "TRUE"', function () {
      assert(isit.boolish('TRUE'))
    })

    it('should return true if value is "false"', function () {
      assert(isit.boolish('false'))
    })

    it('should return true if value is "FALSE"', function () {
      assert(isit.boolish('FALSE'))
    })

    it('should return false if value is something else', function () {
      assert(!isit.boolish(1))
      assert(!isit.boolish({}))
    })
  })

  describe('#true()', function () {
    it('should return true if value is a true boolean', function () {
      assert(isit.true(true))
    })

    it('should return false if value is a false boolean', function () {
      assert(!isit.true(false))
    })

    it('should return true if value is a true Boolean object', function () {
      assert(isit.true(new Boolean(true))) // eslint-disable-line no-new-wrappers
    })

    it('should return false if value is a false Boolean object', function () {
      assert(!isit.true(new Boolean(false))) // eslint-disable-line no-new-wrappers
    })

    it('should return true if value is "true"', function () {
      assert(isit.true('true'))
    })

    it('should return true if value is "TRUE"', function () {
      assert(isit.true('TRUE'))
    })

    it('should return false if value is "false"', function () {
      assert(!isit.true('false'))
    })

    it('should return false if value is neither boolean nor Boolean object', function () {
      assert(!isit.true(1))
      assert(!isit.true({}))
    })
  })

  describe('#truthy()', function () {
    it('should return true if value is a true boolean', function () {
      assert(isit.truthy(true))
    })

    it('should return false if value is a false boolean', function () {
      assert(!isit.truthy(false))
    })

    it('should return true if value is a true Boolean object', function () {
      assert(isit.truthy(new Boolean(true))) // eslint-disable-line no-new-wrappers
    })

    it('should return false if value is a false Boolean object', function () {
      assert(!isit.truthy(new Boolean(false))) // eslint-disable-line no-new-wrappers
    })

    it('should return true if value is "true"', function () {
      assert(isit.truthy('true'))
    })

    it('should return false if value is "false"', function () {
      assert(!isit.truthy('false'))
    })

    it('should return true if value is 1', function () {
      assert(isit.truthy(1))
    })

    it('should return false if value is 0', function () {
      assert(!isit.truthy(0))
    })

    it('should return true if value is a string', function () {
      assert(isit.truthy('test'))
    })

    it('should return false if value is an empty string', function () {
      assert(!isit.truthy(''))
    })
  })

  describe('#false()', function () {
    it('should return true if value is a false boolean', function () {
      assert(isit.false(false))
    })

    it('should return false if value is a true boolean', function () {
      assert(!isit.false(true))
    })

    it('should return true if value is a false Boolean object', function () {
      assert(isit.false(new Boolean(false))) // eslint-disable-line no-new-wrappers
    })

    it('should return false if value is a true Boolean object', function () {
      assert(!isit.false(new Boolean(true))) // eslint-disable-line no-new-wrappers
    })

    it('should return true if value is "false"', function () {
      assert(isit.false('false'))
    })

    it('should return true if value is "FALSE"', function () {
      assert(isit.false('FALSE'))
    })

    it('should return false if value is "true"', function () {
      assert(!isit.false('true'))
    })

    it('should return false if value is neither boolean nor Boolean object', function () {
      assert(!isit.false(0))
      assert(!isit.false(''))
    })
  })

  describe('#falsey()', function () {
    it('should return true if value is a false boolean', function () {
      assert(isit.falsey(false))
    })

    it('should return false if value is a true boolean', function () {
      assert(!isit.falsey(true))
    })

    it('should return true if value is a false Boolean object', function () {
      assert(isit.falsey(new Boolean(false))) // eslint-disable-line no-new-wrappers
    })

    it('should return false if value is a true Boolean object', function () {
      assert(!isit.falsey(new Boolean(true))) // eslint-disable-line no-new-wrappers
    })

    it('should return true if value is "false"', function () {
      assert(isit.falsey('false'))
    })

    it('should return false if value is "true"', function () {
      assert(!isit.falsey('true'))
    })

    it('should return true if value is 0', function () {
      assert(isit.falsey(0))
    })

    it('should return false if value is 1', function () {
      assert(!isit.falsey(1))
    })

    it('should return true if value is an empty string', function () {
      assert(isit.falsey(''))
    })

    it('should return false if value is a string', function () {
      assert(!isit.falsey('test'))
    })
  })

  describe('#empty()', function () {
    it('should return true if value is undefined', function () {
      assert(isit.empty(undefined)) // eslint-disable-line no-undefined
    })

    it('should return true if value is null', function () {
      assert(isit.empty(null))
    })

    it('should return true if value is NaN', function () {
      assert(isit.empty(NaN))
    })

    it('should return false if value is 0', function () {
      assert(!isit.empty(0))
    })

    it('should return false if value is false', function () {
      assert(!isit.empty(false))
    })

    it('should return true if value is empty string', function () {
      assert(isit.empty(''))
    })

    it('should return false if value is non-empty string', function () {
      assert(!isit.empty('test'))
    })

    it('should return false if value is string with only whitespace', function () {
      assert(!isit.empty('     '))
    })

    it('should return true if value is empty String object', function () {
      assert(isit.empty(new String(''))) // eslint-disable-line no-new-wrappers
    })

    it('should return true if value is empty object', function () {
      assert(isit.empty({}))
    })

    it('should return false if value is non-empty object', function () {
      assert(!isit.empty({a: 1}))
    })

    it('should return true if value is empty array', function () {
      assert(isit.empty([]))
    })

    it('should return false if value is non-empty array', function () {
      assert(!isit.empty([1, 2, 3]))
    })

    it('should return false if value is function', function () {
      assert(!isit.empty(() => {}))
    })

    it('should return true if value is empty Map', function () {
      assert(isit.empty(new Map()))
    })

    it('should return false if value is non-empty Map', function () {
      assert(!isit.empty(new Map([['a', 1]])))
    })

    it('should return true if value is empty Set', function () {
      assert(isit.empty(new Set()))
    })

    it('should return false if value is non-empty Set', function () {
      assert(!isit.empty(new Set([1, 2, 3])))
    })

    it('should return false if value is other object', function () {
      assert(!isit.empty(new Error()))
    })
  })

  describe('#blank()', function () {
    it('should return true if value is empty', function () {
      assert(isit.blank(undefined)) // eslint-disable-line no-undefined
      assert(isit.blank(null))
      assert(isit.blank(NaN))
      assert(isit.blank({}))
      assert(isit.blank([]))
      assert(isit.blank(new Map()))
    })

    it('should return true if value is empty string', function () {
      assert(isit.blank(''))
    })

    it('should return true if value is string with only whitespace', function () {
      assert(isit.blank('     '))
    })

    it('should return true if value is String object with only whitespace', function () {
      assert(isit.blank(new String('     '))) // eslint-disable-line no-new-wrappers
    })
  })

  describe('#function()', function () {
    it('should return true if value is a function', function () {
      assert(isit.function(function () {}))
    })

    it('should return true if value is an arrow function', function () {
      assert(isit.function(() => {}))
    })

    it('should return true if value is a generator function', function () {
      assert(isit.function(function* () {}))
    })

    it('should return false if value is not a function', function () {
      assert(!isit.function('not a function'))
    })
  })

  describe('#generator()', function () {
    it('should return true if value is a generator function', function () {
      assert(isit.generator(function* () {}))
    })

    it('should return false if value is a function', function () {
      assert(!isit.generator(function () {}))
    })

    it('should return false if value is not a function', function () {
      assert(!isit.generator('not a function'))
    })
  })

  describe('#number()', function () {
    it('should return true if value is an integer', function () {
      assert(isit.number(0))
    })

    it('should return true if value is a float', function () {
      assert(isit.number(1.23))
    })

    it('should return true if value is Infinity', function () {
      assert(isit.number(Infinity))
    })

    it('should return false if value is NaN', function () {
      assert(!isit.number(NaN))
    })

    it('should return false if value is a Number object', function () {
      assert(!isit.number(new Number(123))) // eslint-disable-line no-new-wrappers
    })
  })

  describe('#numberish()', function () {
    it('should return true if value is an integer', function () {
      assert(isit.numberish(0))
    })

    it('should return true if value is a float', function () {
      assert(isit.numberish(1.23))
    })

    it('should return true if value is Infinity', function () {
      assert(isit.numberish(Infinity))
    })

    it('should return false if value is NaN', function () {
      assert(!isit.numberish(NaN))
    })

    it('should return true if value is a Number object', function () {
      assert(isit.numberish(new Number(123))) // eslint-disable-line no-new-wrappers
    })
  })

  describe('#numeric()', function () {
    it('should return true if value is an integer', function () {
      assert(isit.numeric(0))
    })

    it('should return true if value is a float', function () {
      assert(isit.numeric(1.23))
    })

    it('should return true if value is Infinity', function () {
      assert(isit.numeric(Infinity))
    })

    it('should return false if value is NaN', function () {
      assert(!isit.numeric(NaN))
    })

    it('should return true if value is a Number object', function () {
      assert(isit.numeric(new Number(123))) // eslint-disable-line no-new-wrappers
    })

    it('should return true if value is an integer string', function () {
      assert(isit.numeric('1'))
    })

    it('should return true if value is an integer String object', function () {
      assert(isit.numeric(new String('1'))) // eslint-disable-line no-new-wrappers
    })

    it('should return true if value is "Infinity"', function () {
      assert(isit.numeric('Infinity'))
    })
  })

  describe('#nan()', function () {
    it('should return true if value is NaN', function () {
      assert(isit.nan(NaN))
    })

    it('should return false if value is something else', function () {
      assert(!isit.nan(0))
      assert(!isit.nan('NaN'))
      assert(!isit.nan('test'))
    })
  })

  describe('#finite()', function () {
    it('should return true if value is an integer', function () {
      assert(isit.finite(123))
    })

    it('should return true if value is a float', function () {
      assert(isit.finite(123.45))
    })

    it('should return true if value is a Number object', function () {
      assert(isit.finite(new Number(123))) // eslint-disable-line no-new-wrappers
    })

    it('should return true if value is a numeric string', function () {
      assert(isit.finite('123'))
    })

    it('should return false if value is Infinity', function () {
      assert(!isit.finite(Infinity))
    })

    it('should return false if value is -Infinity', function () {
      assert(!isit.finite(-Infinity))
    })

    it('should return false if value is NaN', function () {
      assert(!isit.finite(NaN))
    })

    it('should return false if value is not numeric', function () {
      assert(!isit.finite('test'))
      assert(!isit.finite({}))
      assert(!isit.finite(() => {}))
    })
  })

  describe('#infinity()', function () {
    it('should return true if value is Infinity', function () {
      assert(isit.infinity(Infinity))
    })

    it('should return true if value is Infinity wrapped in a Number object', function () {
      assert(isit.infinity(new Number(Infinity))) // eslint-disable-line no-new-wrappers
    })

    it('should return true if value is -Infinity', function () {
      assert(isit.infinity(-Infinity))
    })

    it('should return true if value is -Infinity wrapped in a Number object', function () {
      assert(isit.infinity(new Number(-Infinity))) // eslint-disable-line no-new-wrappers
    })

    it('should return true if value is "Infinity"', function () {
      assert(isit.infinity('Infinity'))
    })

    it('should return false if value is a finite number', function () {
      assert(!isit.infinity(123))
    })

    it('should return false if value is NaN', function () {
      assert(!isit.infinity(NaN))
    })

    it('should return false if value is not numeric', function () {
      assert(!isit.infinity('test'))
      assert(!isit.infinity({}))
      assert(!isit.infinity(() => {}))
    })
  })

  describe('#integer()', function () {
    it('should return true if value is an integer', function () {
      assert(isit.integer(123))
    })

    it('should return false if value is a float', function () {
      assert(!isit.integer(123.45))
    })

    it('should return true if value is an integer wrapped in a Number object', function () {
      assert(isit.integer(new Number(123))) // eslint-disable-line no-new-wrappers
    })

    it('should return true if value is an integer string', function () {
      assert(isit.integer('123'))
    })

    it('should return false if value is NaN', function () {
      assert(!isit.integer(NaN))
    })

    it('should return false if value is Infinity', function () {
      assert(!isit.integer(Infinity))
    })

    it('should return false if value is not numeric', function () {
      assert(!isit.integer('test'))
      assert(!isit.integer({}))
      assert(!isit.integer(() => {}))
    })
  })

  describe('#int()', function () {
    it('should return true if value is an integer', function () {
      assert(isit.int(123))
    })

    it('should return false if value is a float', function () {
      assert(!isit.int(123.45))
    })
  })

  describe('#float()', function () {
    it('should return true if value is a float', function () {
      assert(isit.float(123.45))
    })

    it('should return false if value is an integer', function () {
      assert(!isit.float(123))
    })

    it('should return true if value is a float wrapped in a Number object', function () {
      assert(isit.float(new Number(123.45))) // eslint-disable-line no-new-wrappers
    })

    it('should return true if value is a float string', function () {
      assert(isit.float('123.45'))
    })

    it('should return false if value is NaN', function () {
      assert(!isit.float(NaN))
    })

    it('should return false if value is Infinity', function () {
      assert(!isit.float(Infinity))
    })

    it('should return false if value is not numeric', function () {
      assert(!isit.float('test'))
      assert(!isit.float({}))
      assert(!isit.float(() => {}))
    })
  })

  describe('#positive()', function () {
    it('should return true if value is a positive integer', function () {
      assert(isit.positive(123))
    })

    it('should return true if value is a positive float', function () {
      assert(isit.positive(123.45))
    })

    it('should return false if value is a negative integer', function () {
      assert(!isit.positive(-123))
    })

    it('should return true if value is a positive Number object', function () {
      assert(isit.positive(new Number(123))) // eslint-disable-line no-new-wrappers
    })

    it('should return true if value is a positive numeric string', function () {
      assert(isit.positive('123.45'))
    })

    it('should return true if value is positive zero', function () {
      assert(isit.positive(0))
    })

    it('should return false if value is negative zero', function () {
      assert(!isit.positive(-0))
    })

    it('should return true if value is Infinity', function () {
      assert(isit.positive(Infinity))
    })

    it('should return false if value is -Infinity', function () {
      assert(!isit.positive(-Infinity))
    })

    it('should return false if value is NaN', function () {
      assert(!isit.positive(NaN))
    })

    it('should return false if value is not numeric', function () {
      assert(!isit.positive('test'))
      assert(!isit.positive({}))
      assert(!isit.positive(() => {}))
    })
  })

  describe('#negative()', function () {
    it('should return true if value is a negative integer', function () {
      assert(isit.negative(-123))
    })

    it('should return true if value is a negative float', function () {
      assert(isit.negative(-123.45))
    })

    it('should return false if value is a positive number', function () {
      assert(!isit.negative(123))
    })

    it('should return true if value is a negative Number object', function () {
      assert(isit.negative(new Number(-123))) // eslint-disable-line no-new-wrappers
    })

    it('should return true if value is a negative numeric string', function () {
      assert(isit.negative('-123.45'))
    })

    it('should return true if value is negative zero', function () {
      assert(isit.negative(-0))
    })

    it('should return true if value is -Infinity', function () {
      assert(isit.negative(-Infinity))
    })

    it('should return false if value is Infinity', function () {
      assert(!isit.negative(Infinity))
    })

    it('should return false if value is NaN', function () {
      assert(!isit.negative(NaN))
    })

    it('should return false if value is not numeric', function () {
      assert(!isit.negative('test'))
      assert(!isit.negative({}))
      assert(!isit.negative(() => {}))
    })
  })

  describe('#objectbased()', function () {
    it('should return true if value is an object', function () {
      assert(isit.objectbased({}))
    })

    it('should return true if value is a function', function () {
      assert(isit.objectbased(() => {}))
    })

    it('should return false if value is something else', function () {
      assert(!isit.objectbased('test'))
      assert(!isit.objectbased(123))
      assert(!isit.objectbased(undefined)) // eslint-disable-line no-undefined
    })
  })

  describe('#object()', function () {
    it('should return true if value is a plain object', function () {
      assert(isit.object({}))
    })

    it('should return true if value is an object', function () {
      assert(isit.object(/./))
      assert(isit.object(new Error()))
      assert(isit.object(new Date()))
    })

    it('should return true if value is an array', function () {
      assert(isit.object([]))
    })

    it('should return false if value is null', function () {
      assert(!isit.object(null))
    })

    it('should return false if value is a function', function () {
      assert(!isit.object(() => {}))
    })

    it('should return false if value is something else', function () {
      assert(!isit.object('test'))
      assert(!isit.object(123))
      assert(!isit.object(undefined)) // eslint-disable-line no-undefined
    })
  })

  describe('#plain()', function () {
    it('should return true if value is a plain object', function () {
      assert(isit.plain({}))
    })

    it('should return false if value is a non-plain object', function () {
      assert(!isit.plain(/./))
      assert(!isit.plain(new Error()))
      assert(!isit.plain(new Date()))
    })

    it('should return false if value is an array', function () {
      assert(!isit.plain([]))
    })

    it('should return false if value is null', function () {
      assert(!isit.plain(null))
    })

    it('should return false if value is something else', function () {
      assert(!isit.plain('test'))
      assert(!isit.plain(123))
      assert(!isit.plain(undefined)) // eslint-disable-line no-undefined
    })
  })

  describe('#array()', function () {
    it('should return true if value is an array', function () {
      assert(isit.array([]))
    })

    it('should return false if value is something else', function () {
      assert(!isit.array({}))
      assert(!isit.array('test'))
      assert(!isit.array(123))
    })
  })

  describe('#args()', function () {
    it('should return true if value is arguments object', function () {
      assert(isit.args(arguments))
    })

    it('should return false if value is object', function () {
      assert(!isit.args({}))
    })

    it('should return false if value is array', function () {
      assert(!isit.args([]))
    })
  })

  describe('#collection()', function () {
    for (const cls of [Map, Set, WeakMap, WeakSet]) {
      it('should return true if value is a ' + cls.name, function () {
        assert(isit.collection(new cls())) // eslint-disable-line new-cap
      })
    }

    it('should return false if value is object', function () {
      assert(!isit.collection({}))
    })

    it('should return false if value is array', function () {
      assert(!isit.collection([]))
    })
  })

  describe('#iterable()', function () {
    it('should return true if value is iterator', function () {
      const map = new Map()
      assert(isit.iterable(map.values()))
    })

    it('should return true if value is array', function () {
      assert(isit.iterable([]))
    })
  })

  describe('#typedarray()', function () {
    for (const cls of [Int8Array, Uint8Array, Uint8ClampedArray, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array]) {
      it('should return true if value is ' + cls.name, function () {
        assert(isit.typedarray(new cls())) // eslint-disable-line new-cap
      })
    }

    it('should return false if value is object', function () {
      assert(!isit.collection({}))
    })

    it('should return false if value is array', function () {
      assert(!isit.collection([]))
    })
  })

  describe('#string()', function () {
    it('should return true if value is a string', function () {
      assert(isit.string('test'))
    })

    it('should return true if value is an empty string', function () {
      assert(isit.string(''))
    })

    it('should return false if value is a String object', function () {
      assert(!isit.string(new String('test'))) // eslint-disable-line no-new-wrappers
    })

    it('should return false if value is something else', function () {
      assert(!isit.string({}))
      assert(!isit.string(123))
    })
  })

  describe('#stringish()', function () {
    it('should return true if value is a string', function () {
      assert(isit.stringish('test'))
    })

    it('should return true if value is an empty string', function () {
      assert(isit.stringish(''))
    })

    it('should return true if value is a String object', function () {
      assert(isit.stringish(new String('test'))) // eslint-disable-line no-new-wrappers
    })

    it('should return false if value is something else', function () {
      assert(!isit.stringish({}))
      assert(!isit.stringish(123))
    })
  })

  describe('#symbol()', function () {
    it('should return true if value is a symbol', function () {
      assert(isit.symbol(Symbol.iterator))
    })

    it('should return false if value is something else', function () {
      assert(!isit.symbol({}))
      assert(!isit.symbol(123))
    })
  })
})

describe('isit/x', function () {
  it('should support adding an additional test', function () {
    const isitx = require('./x')({zero: val => val === 0})
    assert(isitx('negative zero', -0))
  })
})
