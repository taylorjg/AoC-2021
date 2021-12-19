const fs = require('fs').promises

const {
  parseNumber,
  formatNumber,
  isRoot,
  isRegular,
  isNode,
  explode,
  reduce,
  add,
  magnitude
} = require('./logic')

const main = async () => {
  const buffer = await fs.readFile('day18/example1.txt')
  // const buffer = await fs.readFile('day18/input.txt')
  const lines = buffer.toString().split('\n').filter(Boolean)
  const numbers = lines.map(parseNumber)
  // numbers.forEach(n => console.log(formatNumber(n)))
  // part1(numbers)
  const c = add(numbers[0], numbers[1])
  // const d = add(c, numbers[2])
  // const e = add(d, numbers[3])

  // this works
  // const a = parseNumber('[[[[4,3],4],4],[7,[[8,4],9]]]')
  // const b = parseNumber('[1,1]')
  // add(a, b)

  // const regulars = listRegulars(numbers[0])
  // const v1 = []
  // regulars.forEach(n => {
  //   if (isRegular(n.left)) {
  //     v1.push(n.left)
  //   }
  //   if (isRegular(n.right)) {
  //     v1.push(n.right)
  //   }
  // })
  // console.dir(v1)
}

main()
