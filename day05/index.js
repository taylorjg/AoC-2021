const fs = require('fs').promises
const R = require('ramda')

const parseLineString = lineString => {
  const r = /^(\d+),(\d+) -> (\d+),(\d+)$/
  const m = lineString.match(r)
  if (m) {
    const numberStrings = m.slice(1)
    const [x1, y1, x2, y2] = numberStrings.map(Number)
    return { x1, y1, x2, y2 }
  } else {
    throw new Error(`failed to parse ${lineString}`)
  }
}

const incCount = (map, x, y) => {
  const key = `${x}:${y}`
  const oldCount = map.has(key) ? map.get(key) : 0
  const newCount = oldCount + 1
  map.set(key, newCount)
}

const addHorizontalLines = (lines, map) => {
  const hlines = lines.filter(({ y1, y2 }) => y1 === y2)
  for (const { x1, x2, y1: y } of hlines) {
    const minx = Math.min(x1, x2)
    const maxx = Math.max(x1, x2)
    for (const x of R.range(minx, maxx + 1)) {
      incCount(map, x, y)
    }
  }
}

const addVerticalLines = (lines, map) => {
  const vlines = lines.filter(({ x1, x2 }) => x1 === x2)
  for (const { y1, y2, x1: x } of vlines) {
    const miny = Math.min(y1, y2)
    const maxy = Math.max(y1, y2)
    for (const y of R.range(miny, maxy + 1)) {
      incCount(map, x, y)
    }
  }
}

const addDiagonalLines = (lines, map) => {
  const dlines = lines.filter(({ x1, x2, y1, y2 }) => x1 !== x2 && y1 !== y2)
  for (const { x1, y1, x2, y2 } of dlines) {
    const minx = Math.min(x1, x2)
    const maxx = Math.max(x1, x2)
    const len = maxx - minx
    for (const i of R.range(0, len + 1)) {
      const dx = x2 > x1 ? i : -i
      const dy = y2 > y1 ? i : -i
      incCount(map, x1 + dx, y1 + dy)
    }
  }
}

const part1 = lines => {
  const map = new Map()
  addHorizontalLines(lines, map)
  addVerticalLines(lines, map)
  const answer = Array.from(map.values()).filter(count => count > 1).length
  console.log('Answer (part1):', answer)
}

const part2 = lines => {
  const map = new Map()
  addHorizontalLines(lines, map)
  addVerticalLines(lines, map)
  addDiagonalLines(lines, map)
  const answer = Array.from(map.values()).filter(count => count > 1).length
  console.log('Answer (part2):', answer)
}

const main = async () => {
  // const buffer = await fs.readFile('day05/example.txt')
  const buffer = await fs.readFile('day05/input.txt')
  const lineStrings = buffer.toString().split('\n').filter(Boolean)
  const lines = lineStrings.map(parseLineString)
  part1(lines)
  part2(lines)
}

main()
