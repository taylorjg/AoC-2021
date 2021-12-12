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

const SIGNALS_TO_DIGITS = new Map(Array.from(SIGNALS_PER_DIGIT.entries()).map(([k, v]) => [v, k]))

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

const decodeSignals = entry => {
  const one = Array.from(entry.signals.find(s => s.length === 2))
  const four = Array.from(entry.signals.find(s => s.length === 4))
  const seven = Array.from(entry.signals.find(s => s.length === 3))
  const eight = Array.from(entry.signals.find(s => s.length === 7))

  const aaaa = R.difference(seven, one)[0]
  const ccccOptions = one
  const bbbbOptions = R.difference(four, one)
  const ddddOptions = R.difference(four, one)

  const with5 = entry.signals.filter(s => s.length === 5) // 2 or 3 or 5
  const allwith5 = with5.reduce((a, b) => a + b, '')
  const with5counts = R.compose(
    R.filter(length => length === 1),
    R.map(vs => vs.length),
    R.groupBy(R.identity)
  )(allwith5)
  const bbbb = R.intersection(bbbbOptions, R.keys(with5counts))[0]
  const eeee = R.difference(R.keys(with5counts), [bbbb])[0]
  const dddd = R.difference(ddddOptions, [bbbb])[0]
  const gggg = R.difference(eight, [...ccccOptions, aaaa, bbbb, dddd, eeee])[0]

  const with6 = entry.signals.filter(s => s.length === 6) // 0 or 6 or 9
  const allwith6 = with6.reduce((a, b) => a + b, '')
  const with6counts = R.compose(
    R.map(vs => vs.length),
    R.groupBy(R.identity)
  )(allwith6)
  const ccccOptionsWithCounts = R.toPairs(with6counts).filter(([k]) => ccccOptions.includes(k))
  const cccc = ccccOptionsWithCounts.find(([, v]) => v === 2)[0]
  const ffff = R.difference(ccccOptions, [cccc])[0]

  return new Map([
    [aaaa, 'a'],
    [bbbb, 'b'],
    [cccc, 'c'],
    [dddd, 'd'],
    [eeee, 'e'],
    [ffff, 'f'],
    [gggg, 'g']
  ])
}

const decodeOutputDigit = decodedSignals => outputDigit => {
  const s = Array.from(outputDigit)
    .map(ch => decodedSignals.get(ch))
    .sort()
    .join('')
  return SIGNALS_TO_DIGITS.get(s)
}

const decodeOutputDigits = entry => {
  const decodedSignals = decodeSignals(entry)
  const [thousands, hundreds, tens, units] = entry.outputDigits.map(decodeOutputDigit(decodedSignals))
  return thousands * 1000 + hundreds * 100 + tens * 10 + units
}

const part2 = entries => {
  const values = entries.map(decodeOutputDigits)
  const answer = values.reduce((a, b) => a + b, 0)
  console.log('Answer (part2):', answer)
}

const main = async () => {
  // const buffer = await fs.readFile('day08/example.txt')
  const buffer = await fs.readFile('day08/input.txt')
  const lines = buffer.toString().split('\n').filter(Boolean)
  const entries = lines.map(parseEntry)
  part1(entries)
  part2(entries)
}

main()
