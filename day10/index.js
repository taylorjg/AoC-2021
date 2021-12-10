const fs = require('fs').promises
const R = require('ramda')

const TABLE = new Map([
  [')', 3],
  [']', 57],
  ['}', 1197],
  ['>', 25137]
])

const PAIRS = new Map([
  ['(', ')'],
  ['[', ']'],
  ['{', '}'],
  ['<', '>']
])

const isClosing = ch => Array.from(PAIRS.values()).includes(ch)

const validateChunk = chunk => {
  const stack = []
  const chars = Array.from(chunk)
  for (const ch of chars) {
    if (stack.length === 0) {
      stack.push(PAIRS.get(ch))
    } else {
      const top = stack.slice(-1)[0]
      if (ch === top) {
        stack.pop()
      } else {
        if (isClosing(ch)) {
          return { ok: false, firstIllegalChar: ch }
        } else {
          stack.push(PAIRS.get(ch))
        }
      }
    }
  }
  return { ok: true }
}

const part1 = (chunks) => {
  const results = chunks.map(validateChunk)
  const badResults = results.filter(({ ok }) => !ok)
  const answer = badResults.reduce((acc, r) => acc + TABLE.get(r.firstIllegalChar), 0)
  console.log('Answer (part1):', answer)
}

const main = async () => {
  // const buffer = await fs.readFile('day10/example.txt')
  const buffer = await fs.readFile('day10/input.txt')
  const chunks = buffer.toString().split('\n').filter(Boolean)
  part1(chunks)
}

main()
