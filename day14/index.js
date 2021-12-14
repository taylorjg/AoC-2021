const fs = require('fs').promises
const R = require('ramda')

const sum = xs => xs.reduce((a, b) => a + b, 0)

const initialisePairCounts = s => {
  const pairCounts = new Map()
  for (const index of R.range(0, s.length - 1)) {
    const pair = s.slice(index, index + 2)
    const currentCount = pairCounts.get(pair) ?? 0
    const newCount = currentCount + 1
    pairCounts.set(pair, newCount)
  }
  return pairCounts
}

const initialiseCharCounts = s => {
  const charCounts = new Map()
  for (const ch of Array.from(s)) {
    const currentCount = charCounts.get(ch) ?? 0
    const newCount = currentCount + 1
    charCounts.set(ch, newCount)
  }
  return charCounts
}

const applyRules = (pairCounts, charCounts, rules) => {
  const adjustments = []
  for (const { pair, insert } of rules) {
    if (pairCounts.has(pair)) {
      const count = pairCounts.get(pair)
      const [A, B] = pair
      const C = insert
      pairCounts.delete(pair)
      adjustments.push({ pair: A + C, count })
      adjustments.push({ pair: C + B, count })
      const currentCharCount = charCounts.get(C) ?? 0
      const newCharCount = currentCharCount + count
      charCounts.set(C, newCharCount)
    }
  }
  for (const { pair, count } of adjustments) {
    const currentCount = pairCounts.get(pair) ?? 0
    const newCount = currentCount + count
    pairCounts.set(pair, newCount)
  }
}

const part1 = (template, rules, steps) => {
  let pairCounts = initialisePairCounts(template)
  let charCounts = initialiseCharCounts(template)
  for (const _ of R.range(0, steps)) {
    applyRules(pairCounts, charCounts, rules)
  }
  console.dir(pairCounts)
  console.dir(charCounts)
  const sortedCounts = Array.from(charCounts.values()).sort((a, b) => b - a)
  const mostCommon = R.head(sortedCounts)
  const leastCommon = R.last(sortedCounts)
  const answer = mostCommon - leastCommon
  console.log('Answer (part1):', answer)
}

const parseRule = line => {
  const bits = line.split(/\s+->\s+/)
  return {
    pair: bits[0],
    insert: bits[1]
  }
}

const main = async () => {
  // const buffer = await fs.readFile('day14/example.txt')
  const buffer = await fs.readFile('day14/input.txt')
  const lines = buffer.toString().split('\n').filter(Boolean)
  const template = lines.shift()
  const rules = lines.map(parseRule)
  part1(template, rules, 10)
  part1(template, rules, 40)
}

main()
