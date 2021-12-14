const fs = require('fs').promises
const R = require('ramda')

const part1 = (template, rules) => {
  console.log('Answer (part1):', 0)
}

const parseRule = line => {
  const bits = line.split(/\s+->\s+/)
  return {
    e1: bits[0][0],
    e2: bits[0][1],
    e3: bits[1]
  }
}

const main = async () => {
  const buffer = await fs.readFile('day14/example.txt')
  // const buffer = await fs.readFile('day14/input.txt')
  const lines = buffer.toString().split('\n').filter(Boolean)
  const template = lines.shift()
  const rules = lines.map(parseRule)
  console.log('template:', template)
  console.dir(rules)
  part1(template, rules)
}

main()
