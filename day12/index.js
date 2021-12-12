const fs = require('fs').promises
const R = require('ramda')

const buildAdjacencyMatrix = (vs, es) => {
  const n = vs.length
  const am = R.range(0, n).map(_ => Array(n).fill(0, 0, n))
  for (const e of es) {
    const i = vs.findIndex(v => v === e.from)
    const j = vs.findIndex(v => v === e.to)
    am[i][j] += 1
    am[j][i] += 1
  }
  return am
}

const isSmallCave = n => /^[a-z]+$/.test(n)

const part1 = (vs, am) => {

  const paths = new Set()

  const traverse = (i, pis, pns) => {
    const js = am[i].flatMap((bit, index) => bit ? [index] : [])
    for (const j of js) {
      const jn = vs[j]
      if (isSmallCave(jn) && pns.includes(jn)) {
        // Stop following this path
        continue
      }
      const pis2 = pis.slice()
      pis2.push(j)
      const pns2 = pns.slice()
      pns2.push(jn)
      if (jn === 'end') {
        const fullPathName = pns2.join(',')
        paths.add(fullPathName)
      } else {
        traverse(j, pis2, pns2)
      }
    }
  }

  const startIndex = vs.findIndex(v => v === 'start')
  traverse(startIndex, [startIndex], ['start'])

  console.log('Answer (part1):', paths.size)
}

const part2 = (vs, am) => {

  const paths = new Set()

  const traverse = (i, pis, pns, twoVisitCave) => {
    const js = am[i].flatMap((bit, index) => bit ? [index] : [])
    for (const j of js) {
      const jn = vs[j]

      if (isSmallCave(jn)) {
        if (twoVisitCave) {
          if (jn === twoVisitCave) {
            const count = pns.filter(n => n === jn).length
            if (count >= 2) {
              continue
            }
          } else {
            if (pns.includes(jn)) {
              continue
            }
          }
        } else {
          if (pns.includes(jn)) {
            continue
          }
        }
      }

      const pis2 = pis.slice()
      pis2.push(j)

      const pns2 = pns.slice()
      pns2.push(jn)

      if (jn === 'end') {
        const fullPathName = pns2.join(',')
        paths.add(fullPathName)
      } else {
        if (twoVisitCave) {
          traverse(j, pis2, pns2, twoVisitCave)
          const count = pns2.filter(n => n === twoVisitCave).length
          if (count === 1 && isSmallCave(jn) && jn !== 'start') {
            traverse(j, pis2, pns2, jn)
          }
        } else {
          if (isSmallCave(jn) && jn !== 'start') {
            traverse(j, pis2, pns2, jn)
          } else {
            traverse(j, pis2, pns2)
          }
        }
      }
    }
  }

  const startIndex = vs.findIndex(v => v === 'start')
  traverse(startIndex, [startIndex], ['start'])

  console.log('Answer (part2):', paths.size)
}

const main = async () => {
  // const buffer = await fs.readFile('day12/example1.txt')
  // const buffer = await fs.readFile('day12/example2.txt')
  // const buffer = await fs.readFile('day12/example3.txt')
  const buffer = await fs.readFile('day12/input.txt')
  const lines = buffer.toString().split('\n').filter(Boolean)
  const edges = lines.map(line => line.split('-')).map(([from, to]) => ({ from, to }))
  const froms = edges.map(({ from }) => from)
  const tos = edges.map(({ to }) => to)
  const vertices = Array.from(new Set([...froms, ...tos]))
  const am = buildAdjacencyMatrix(vertices, edges)
  part1(vertices, am)
  part2(vertices, am)
}

main()
