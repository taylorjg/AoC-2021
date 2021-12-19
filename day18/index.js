const fs = require('fs').promises

const {
  parseNumber,
  add,
  magnitude
} = require('./logic')

const part1 = numbers => {
  const result = numbers.reduce(add)
  const answer = magnitude(result)
  console.log('Answer (part1):', answer)
}

const main = async () => {
  // const buffer = await fs.readFile('day18/example2.txt')
  const buffer = await fs.readFile('day18/input.txt')
  const lines = buffer.toString().split('\n').filter(Boolean)
  const numbers = lines.map(parseNumber)
  part1(numbers)
}

main()
