module.exports = function (lvalue, operator, rvalue, options) {
  let operators, result

  if (arguments.length < 3) {
    throw new Error('Handlerbars Helper \'compare\' needs 2 parameters')
  }

  if (options === undefined) {
    options = rvalue
    rvalue = operator
    operator = '==='
  }

  operators = {
    /* eslint-disable */
    '==': function (l, r) { return l == r },
    '===': function (l, r) { return l === r },
    '!=': function (l, r) { return l != r },
    '!==': function (l, r) { return l !== r },
    '<': function (l, r) { return l < r },
    '>': function (l, r) { return l > r },
    '<=': function (l, r) { return l <= r },
    '>=': function (l, r) { return l >= r },
    '||': function (l, r) { return l || r },
    '&&': function (l, r) { return l && r },
    'typeof': function (l, r) { return typeof l == r }
    /* eslint-enable */
  }

  if (!operators[operator]) {
    throw new Error('Handlerbars Helper \'compare\' doesn\'t know the operator ' + operator)
  }

  result = operators[operator](lvalue, rvalue)

  if (result) {
    return options.fn(this)
  } else {
    return options.inverse(this)
  }
}
