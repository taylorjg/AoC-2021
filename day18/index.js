const fs = require('fs').promises

const { parseNumber, add, magnitude } = require('./logic')

const part1 = numbers => {
  const result = numbers.reduce(add)
  const answer = magnitude(result)
  console.log('Answer (part1):', answer)
}

const part2 = lines => {
  const values = []
  lines.slice(0, -1).forEach((line1, index) => {
    lines.slice(index + 1).forEach((line2, index) => {
      values.push(magnitude(add(parseNumber(line1), parseNumber(line2))))
      values.push(magnitude(add(parseNumber(line2), parseNumber(line1))))
    })
  })
  const answer = Math.max(...values)
  console.log('Answer (part2):', answer)
}

const main = async () => {
  // const buffer = await fs.readFile('day18/example2.txt')
  const buffer = await fs.readFile('day18/input.txt')
  const lines = buffer.toString().split('\n').filter(Boolean)
  const numbers = lines.map(parseNumber)
  part1(numbers)
  part2(lines)
}

main()
