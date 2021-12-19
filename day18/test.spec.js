const { expect } = require('@jest/globals')

const {
  parseNumber,
  formatNumber,
  isRegular,
  explode,
  reduce,
  add,
  magnitude,
  isNode
} = require('./logic')

test.each([
  '[1,2]',
  '[[1,2],3]',
  '[9,[8,7]]',
  '[[1,9],[8,5]]',
  '[[[[1,2],[3,4]],[[5,6],[7,8]]],9]',
  '[[[9,[3,8]],[[0,9],6]],[[[3,7],[4,9]],3]]',
  '[[[[1,3],[5,3]],[[1,3],[8,7]]],[[[4,9],[6,9]],[[8,2],[7,3]]]]'
])('parseNumber/formatNumber round trip (%s)', line => {
  expect(formatNumber(parseNumber(line))).toBe(line)
})

test.each([
  ['[[1,2],[[3,4],5]]', 143],
  ['[[[[0,7],4],[[7,8],[6,0]]],[8,1]]', 1384],
  ['[[[[1,1],[2,2]],[3,3]],[4,4]]', 445],
  ['[[[[3,0],[5,3]],[4,4]],[5,5]]', 791],
  ['[[[[5,0],[7,4]],[5,5]],[6,6]]', 1137],
  ['[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]', 3488]
])('magnitude %s = %i', (line, expected) => {
  expect(magnitude(parseNumber(line))).toBe(expected)
})

const findNode = (number, pair) => {
  const [left, right] = pair
  const helper = n => {
    if (isRegular(n)) return null
    if (n.left === left && n.right === right) return n
    const leftResult = helper(n.left)
    if (leftResult) return leftResult
    const rightResult = helper(n.right)
    if (rightResult) return rightResult
    return null
  }
  return helper(number)
}

test.each([
  ['[[[[[9,8],1],2],3],4]', [9, 8], '[[[[0,9],2],3],4]'],
  ['[7,[6,[5,[4,[3,2]]]]]', [3, 2], '[7,[6,[5,[7,0]]]]'],
  ['[[6,[5,[4,[3,2]]]],1]', [3, 2], '[[6,[5,[7,0]]],3]'],
  ['[[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]]', [7, 3], '[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]'],
  ['[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]', [3, 2], '[[3,[2,[8,0]]],[9,[5,[7,0]]]]']
])('explode %s %s = %s', (line, pair, expected) => {
  const number = parseNumber(line)
  const node = findNode(number, pair)
  expect(node).toBeDefined()
  expect(node.left).toBe(pair[0])
  expect(node.right).toBe(pair[1])
  explode(node)
  const actual = formatNumber(number)
  expect(actual).toBe(expected)
})
