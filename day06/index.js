const fs = require('fs').promises
const R = require('ramda')

const part1 = (initialAges, days) => {
  let ages = initialAges.slice()
  for (const _ of R.range(0, days)) {
    const additions = []
    for (const i of R.range(0, ages.length)) {
      if (ages[i] === 0) {
        ages[i] = 6
        additions.push(8)
      } else {
        ages[i] -= 1
      }
    }
    ages = ages.concat(additions)
  }
  console.log('Answer (part1):', ages.length)
}

const main = async () => {
  // const buffer = await fs.readFile('day06/example.txt')
  const buffer = await fs.readFile('day06/input.txt')
  const initialAges = buffer.toString().split('\n')[0].split(',').map(Number)
  part1(initialAges, 80)
}

main()
