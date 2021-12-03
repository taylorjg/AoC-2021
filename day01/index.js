const fs = require('fs').promises

const part1 = measurements => {
  const lastResult = measurements.reduce(
    (acc, measurement) => {
      const increment = acc.lastMeasurement === undefined
        ? 0
        : measurement > acc.lastMeasurement
      return {
        lastMeasurement: measurement,
        numIncreases: acc.numIncreases + increment
      }
    },
    { lastMeasurement: undefined, numIncreases: 0 })
  console.log('Answer (part1):', lastResult.numIncreases)
}

function* windowGen(xs, n) {
  const window = []
  for (const x of xs) {
    if (window.length === n) {
      window.shift()
    }
    window.push(x)
    if (window.length === n) {
      yield window.slice()
    }
  }
}

const part2 = measurements => {
  const windows = Array.from(windowGen(measurements, 3))
  const lastResult = windows.reduce(
    (acc, window) => {
      const windowSum = window.reduce((acc, measurement) => acc + measurement, 0)
      const increment = acc.lastWindowSum === undefined
        ? 0
        : windowSum > acc.lastWindowSum
      return {
        lastWindowSum: windowSum,
        numIncreases: acc.numIncreases + increment
      }
    },
    { lastWindowSum: undefined, numIncreases: 0 })
  console.log('Answer (part2):', lastResult.numIncreases)
}

const main = async () => {
  const buffer = await fs.readFile('day01/input.txt')
  const measurements = buffer.toString().split('\n').filter(Boolean).map(Number)
  part1(measurements)
  part2(measurements)
}

main()
