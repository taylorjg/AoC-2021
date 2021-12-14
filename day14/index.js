const fs = require('fs').promises
const R = require('ramda')

const sum = xs => xs.reduce((a, b) => a + b, 0)

const splitIntoPairCounts = s => {
  const pairCounts = new Map()
  for (const index of R.range(0, s.length - 1)) {
    const pair = s.slice(index, index + 2)
    const currentCount = pairCounts.get(pair) ?? 0
    const newCount = currentCount + 1
    pairCounts.set(pair, newCount)
  }
  return pairCounts
}

const applyRules = (pairCounts, rules) => {
  const adjustments = []
  for (const { pair, insert } of rules) {
    if (pairCounts.has(pair)) {
      const count = pairCounts.get(pair)
      const [A, B] = pair
      const C = insert
      pairCounts.delete(pair)
      adjustments.push({ pair: A + C, count })
      adjustments.push({ pair: C + B, count })
    }
  }
  for (const { pair, count } of adjustments) {
    const currentCount = pairCounts.get(pair) ?? 0
    const newCount = currentCount + count
    pairCounts.set(pair, newCount)
  }
  return pairCounts
}

const part1 = (template, rules, steps) => {
  let pairCounts = splitIntoPairCounts(template)
  for (const _ of R.range(0, steps)) {
    pairCounts = applyRules(pairCounts, rules)
  }
  console.dir(pairCounts)
  const totalPairs = sum(Array.from(pairCounts.values()))
  console.log('totalPairs:', totalPairs)
  const charCounts = new Map()
  for (const [pair, count] of pairCounts) {
    const [A, B] = pair
    const currentCharCountA = charCounts.get(A) ?? 0
    const newCharCountA = currentCharCountA + count
    charCounts.set(A, newCharCountA)
    const currentCharCountB = charCounts.get(B) ?? 0
    const newCharCountB = currentCharCountB + count
    charCounts.set(B, newCharCountB)
  }
  console.dir(charCounts)
  // console.log('Answer (part1):', 0)
}

const parseRule = line => {
  const bits = line.split(/\s+->\s+/)
  return {
    pair: bits[0],
    insert: bits[1]
  }
}

const main = async () => {
  const buffer = await fs.readFile('day14/example.txt')
  // const buffer = await fs.readFile('day14/input.txt')
  const lines = buffer.toString().split('\n').filter(Boolean)
  const template = lines.shift()
  const rules = lines.map(parseRule)
  part1(template, rules, 10)
}

main()
