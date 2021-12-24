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

const calculateOverlap = (v1, v2, v3, v4) => {
  const a = Math.max(v1, v3)
  const b = Math.min(v2, v4)
  return b > a ? { a, b } : null
}

const cubeOverlap = (cube1, cube2) => {
  const overlapX = calculateOverlap(cube1.x1, cube1.x2, cube2.x1, cube2.x2)
  const overlapY = calculateOverlap(cube1.y1, cube1.y2, cube2.y1, cube2.y2)
  const overlapZ = calculateOverlap(cube1.z1, cube1.z2, cube2.z1, cube2.z2)
  if (overlapX && overlapY && overlapZ) {
    return {
      x1: overlapX.a,
      x2: overlapX.b,
      y1: overlapY.a,
      y2: overlapY.b,
      z1: overlapZ.a,
      z2: overlapZ.b
    }
  } else {
    return null
  }
}

const part2 = rebootSteps => {
  for (const rebootStep of rebootSteps) {
    const others = rebootSteps.filter(rs => rs.index !== rebootStep.index)
    const overlapsWith = []
    for (const other of others) {
      const overlap = cubeOverlap(rebootStep.cube, other.cube)
      if (overlap) {
        overlapsWith.push(other.index)
      }
    }
    if (overlapsWith.length > 0) {
      console.log(`${rebootStep.index} overlaps with ${JSON.stringify(overlapsWith)}`)
    }
  }
  console.log('Answer (part2):', 0)
}

const parseRebootStep = (line, index) => {
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
  return { index, on, cube }
}

const main = async () => {
  const buffer = await fs.readFile('day22/example1.txt')
  // const buffer = await fs.readFile('day22/example2.txt')
  // const buffer = await fs.readFile('day22/input.txt')
  const lines = buffer.toString().split('\n').filter(Boolean)
  const rebootSteps = lines.map(parseRebootStep)
  // part1(rebootSteps)
  part2(rebootSteps)
}

main()
