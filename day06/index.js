const fs = require('fs').promises
const R = require('ramda')

const part1 = (initialAges, days) => {
  let ages = initialAges.slice()
  for (const day of R.range(0, days)) {
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

const processItem = (item, days) => {
  const newEntries = []
  for (const day of R.range(item.day, days)) {
    if (item.age === 0) {
      item.age = 6
      newEntries.push({ age: 8, day: day + 1 })
    } else {
      item.age -= 1
    }
  }
  return newEntries
}

const part2 = (initialAges, days) => {
  let runningLength = initialAges.length
  let queue = initialAges.map(age => ({ age, day: 0 }))
  for (; ;) {
    if (queue.length === 0) break
    const item = queue.shift()
    const newItems = processItem(item, days)
    runningLength += newItems.length
    queue = queue.concat(newItems)
  }
  console.log('Answer (part2):', runningLength)
}

const fred = (item, days, length) => {
  // console.log({ item, days, length })
  for (const day of R.range(item.day, days)) {
    if (item.age === 0) {
      item.age = 6
      length = fred({ age: 8, day: day + 1 }, days, length + 1)
    } else {
      item.age -= 1
    }
  }
  return length
}

const part2New = (initialAges, days) => {
  const initialItems = initialAges.map(age => ({ age, day: 0 }))
  let growth = 0
  for (const item of initialItems) {
    growth += fred(item, days, 0)
  }
  console.log('Answer (part2):', initialAges.length + growth)
}

const sums = n => R.range(1, n + 1).reduce((a, b) => a + b, 0)

const spawnedCount = (age, days) => {
  const dayOfFirstSpawn = age + 1
  const remainingDays = days - dayOfFirstSpawn
  if (remainingDays < 7) return 0
  const remainingDays2 = remainingDays - 9
  console.log({ dayOfFirstSpawn, remainingDays, remainingDays2 })
  if (remainingDays2 > 0) {
    const v2 = Math.floor(remainingDays2 / 7)
    console.log({ v2 })
    return 1 + sums(v2 + 1)
  } else {
    return 1
  }
}

const part2Again = (initialAges, days) => {
  let total = initialAges.length
  for (const age of initialAges) {
    total += spawnedCount(age, days)
  }
  console.log('Answer (part2):', total)
}

const main = async () => {
  const buffer = await fs.readFile('day06/example.txt')
  // const buffer = await fs.readFile('day06/input.txt')
  const initialAges = buffer.toString().split('\n')[0].split(',').map(Number)

  part1(initialAges, 18)
  part2(initialAges, 18)
  part2Again(initialAges, 18)

  // part1(initialAges, 80)
  // part2(initialAges, 80)
  // part2Again(initialAges, 80)

  // part2Again(initialAges, 256)

  const r = spawnedCount(1, 18)
  console.log({ r })
}

main()
