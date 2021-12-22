const fs = require('fs').promises
const R = require('ramda')

const part1 = rebootSteps => {

  const makeKey = (x, y, z) => `${x}:${y}:${z}`

  const makeRange = (lowIncl, highIncl) => R.range(lowIncl, highIncl + 1)

  const isDimensionWithinRange = (lowIncl, highIncl) => {
    return (
      (lowIncl >= -50 && lowIncl <= 50) ||
      (highIncl >= -50 && highIncl <= 50)
    )
  }

  const isCubeWithinRange = cube => {
    return (
      isDimensionWithinRange(cube.x1, cube.x2) &&
      isDimensionWithinRange(cube.y1, cube.y2) &&
      isDimensionWithinRange(cube.z1, cube.z2)
    )
  }

  const set = new Set()

  for (const { on, cube } of rebootSteps) {
    if (!isCubeWithinRange(cube)) continue
    for (const x of makeRange(cube.x1, cube.x2)) {
      for (const y of makeRange(cube.y1, cube.y2)) {
        for (const z of makeRange(cube.z1, cube.z2)) {
          const key = makeKey(x, y, z)
          if (on) {
            set.add(key)
          } else {
            set.delete(key)
          }
        }
      }
    }
  }

  console.log('Answer (part1):', set.size)
}

const parseRebootStep = line => {
  const bits = line.split(/\s+/)
  const on = bits[0] === 'on'
  const m = bits[1].match(/x=(-?\d+)..(-?\d+),y=(-?\d+)..(-?\d+),z=(-?\d+)..(-?\d+)/)
  const x1 = Number(m[1])
  const x2 = Number(m[2])
  const y1 = Number(m[3])
  const y2 = Number(m[4])
  const z1 = Number(m[5])
  const z2 = Number(m[6])
  const cube = { x1, x2, y1, y2, z1, z2 }
  return { on, cube }
}

const main = async () => {
  // const buffer = await fs.readFile('day22/example1.txt')
  // const buffer = await fs.readFile('day22/example2.txt')
  const buffer = await fs.readFile('day22/input.txt')
  const lines = buffer.toString().split('\n').filter(Boolean)
  const rebootSteps = lines.map(parseRebootStep)
  part1(rebootSteps)
}

main()
