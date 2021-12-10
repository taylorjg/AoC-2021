const fs = require('fs').promises
const R = require('ramda')

const parseEntry = line => {
  const bits = line.split(' | ')
  const signals = bits[0].split(/\s/)
  const outputDigits = bits[1].split(/\s/)
  return { signals, outputDigits }
}

const SIGNALS_PER_DIGIT = new Map([
  [0, 'abcefg'],
  [1, 'cf'],
  [2, 'acdeg'],
  [3, 'acdfg'],
  [4, 'bcdf'],
  [5, 'abdfg'],
  [6, 'abdefg'],
  [7, 'acf'],
  [8, 'abcdefg'],
  [9, 'abcdfg']
])

const part1 = entries => {
  let total = 0
  const digitsOfInterest = [1, 4, 7, 8]
  const lengthsOfInterest = digitsOfInterest.map(d => SIGNALS_PER_DIGIT.get(d).length)
  for (const entry of entries) {
    for (const outputDigit of entry.outputDigits) {
      if (lengthsOfInterest.includes(outputDigit.length)) {
        total += 1
      }
    }
  }
  console.log('Answer (part1):', total)
}

const main = async () => {
  const buffer = await fs.readFile('day08/example.txt')
  // const buffer = await fs.readFile('day08/input.txt')
  const lines = buffer.toString().split('\n').filter(Boolean)
  const entries = lines.map(parseEntry)
  // console.dir(entries)
  part1(entries)
}

main()
