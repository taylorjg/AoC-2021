const fs = require('fs').promises
const R = require('ramda')

const buildAdjacencyMatrix = (vs, es) => {
  const n = vs.length
  const am = R.range(0, n).map(_ => Array(n).fill(0, 0, n))
  for (const e of es) {
    const i = vs.findIndex(v => v == e.from)
    const j = vs.findIndex(v => v == e.to)
    am[i][j] += 1
    am[j][i] += 1
  }
  return am
}

const part1 = edges => {
  console.log('Answer (part1):', 0)
}

const main = async () => {
  const buffer = await fs.readFile('day12/example1.txt')
  // const buffer = await fs.readFile('day12/example2.txt')
  // const buffer = await fs.readFile('day12/example3.txt')
  // const buffer = await fs.readFile('day12/input.txt')
  const lines = buffer.toString().split('\n').filter(Boolean)
  const edges = lines.map(line => line.split('-')).map(([from, to]) => ({ from, to }))
  console.dir(edges)
  const froms = edges.map(({ from }) => from)
  const tos = edges.map(({ to }) => to)
  const vertices = Array.from(new Set([...froms, ...tos]))
  console.dir(vertices)
  const am = buildAdjacencyMatrix(vertices, edges)
  console.dir(am)
  part1(edges)
}

main()
