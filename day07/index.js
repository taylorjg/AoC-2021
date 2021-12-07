const fs = require('fs').promises
const R = require('ramda')

const sum = xs => xs.reduce((a, b) => a + b, 0)

const calcFuel1 = (positions, v) => {
  const calc = p => Math.abs(p - v)
  return sum(positions.map(calc))
}

const part1 = positions => {
  const min = Math.min(...positions)
  const max = Math.max(...positions)
  const things = R.range(min, max + 1).map(v => ({ v, fuel: calcFuel1(positions, v) }))
  const minFuel = Math.min(...things.map(t => t.fuel))
  console.log('Answer (part1):', minFuel)
}

const calcFuel2 = (positions, v) => {
  const calc = p => sum(R.range(1, Math.abs(p - v) + 1))
  return sum(positions.map(calc))
}

const part2 = positions => {
  const min = Math.min(...positions)
  const max = Math.max(...positions)
  const things = R.range(min, max + 1).map(v => ({ v, fuel: calcFuel2(positions, v) }))
  const minFuel = Math.min(...things.map(t => t.fuel))
  console.log('Answer (part2):', minFuel)
}

const main = async () => {
  // const buffer = await fs.readFile('day07/example.txt')
  const buffer = await fs.readFile('day07/input.txt')
  const positions = buffer.toString().split('\n')[0].split(',').map(Number)
  part1(positions)
  part2(positions)
}

main()
