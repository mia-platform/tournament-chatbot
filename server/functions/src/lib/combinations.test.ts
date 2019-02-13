import * as test from "tape"

import combinations from './combinations'

test('should be a function', t => {
  t.deepEqual(typeof combinations, 'function')
  t.end()
})

test('#1', t => {
  const input = ['1', '2', '3', '4', '5']
  const expected = [ ['1'], ['2'], ['3'], ['4'], ['5'] ]
  const result = combinations(input, 1, 1)
  t.deepEqual(result, expected)
  t.end()
})

test('#2', t => {
  const input = ['1', '2', '3', '4', '5']
  const expected = [ [ '1', '2' ], [ '1', '3' ], [ '1', '4' ], [ '1', '5' ], [ '2', '3' ], [ '2', '4' ], [ '2', '5' ], [ '3', '4' ], [ '3', '5' ], [ '4', '5' ] ]
  const result = combinations(input, 2, 2)
  t.deepEqual(result, expected)
  t.end()
})

test('#3', t => {
  const input = ['1', '2', '3', '4', '5']
  const expected = [ ['1'], ['2'], ['3'], ['4'], ['5'], [ '1', '2' ], [ '1', '3' ], [ '1', '4' ], [ '1', '5' ], [ '2', '3' ], [ '2', '4' ], [ '2', '5' ], [ '3', '4' ], [ '3', '5' ], [ '4', '5' ] ]
  const result = combinations(input, 1, 2)
  t.deepEqual(result, expected)
  t.end()
})
