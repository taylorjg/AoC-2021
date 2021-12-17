const MAX_ITERATIONS = 1000

const withinTargetAreaX = (x, targetArea) => {
  return (
    x >= targetArea.left &&
    x <= targetArea.right
  )
}

const withinTargetAreaY = (y, targetArea) => {
  return (
    y <= targetArea.top &&
    y >= targetArea.bottom
  )
}

const withinTargetArea = (x, y, targetArea) => {
  return withinTargetAreaX(x, targetArea) && withinTargetAreaY(y, targetArea)
}

const beyondTargetAreaX = (x, targetArea) => {
  return x > targetArea.right
}

const calculateTrajectoryX = (velocityX, targetArea) => {
  const steps = []
  let currentX = 0
  for (; ;) {
    currentX += velocityX
    steps.push([currentX])
    if (steps.length > MAX_ITERATIONS) return { ok: false }
    if (withinTargetAreaX(currentX, targetArea)) return { ok: true }
    if (beyondTargetAreaX(currentX, targetArea)) return { ok: false }
    if (velocityX > 0) {
      velocityX -= 1
    } else {
      if (velocityX < 0) {
        velocityX += 1
      }
    }
  }
}

const calculateTrajectorySteps = (velocityX, velocityY, targetArea) => {
  const steps = []
  let currentX = 0
  let currentY = 0
  for (; ;) {
    currentX += velocityX
    currentY += velocityY
    steps.push([currentX, currentY])
    if (steps.length > MAX_ITERATIONS) return { ok: false }
    if (withinTargetArea(currentX, currentY, targetArea)) {
      const maxHeight = Math.max(...steps.map(step => step[1]))
      return { ok: true, maxHeight }
    }
    if (beyondTargetAreaX(currentX, targetArea)) return { ok: false }
    if (velocityX > 0) {
      velocityX -= 1
    } else {
      if (velocityX < 0) {
        velocityX += 1
      }
    }
    velocityY -= 1
  }
}

const findRangeX = targetArea => {
  let velocityX = 0
  for (; ;) {
    velocityX += 1
    // console.log('trying min velocityX:', velocityX)
    const r = calculateTrajectoryX(velocityX, targetArea)
    if (r.ok) break
  }
  const minVelocityX = velocityX
  for (; ;) {
    velocityX += 1
    // console.log('trying max velocityX:', velocityX)
    const r = calculateTrajectoryX(velocityX, targetArea)
    if (!r.ok) break
  }
  const maxVelocityX = velocityX
  return { minVelocityX, maxVelocityX }
}

const findRangeY = (velocityX, targetArea) => {
  let velocityY = 0
  let iterations = 0
  const rs = []
  for (; ;) {
    // if (velocityY > 20) return null
    if (iterations++ > MAX_ITERATIONS) return null
    velocityY += 1
    // console.log('trying min velocityY:', velocityY)
    const r = calculateTrajectorySteps(velocityX, velocityY, targetArea)
    // console.log('min velocityY', { velocityX, velocityY, ...r })
    if (r.ok) {
      rs.push({ velocityX, velocityY, ...r })
      break
    }
  }
  // const minVelocityY = velocityY
  iterations = 0
  for (; ;) {
    // if (velocityY > 20) return null
    if (iterations++ > MAX_ITERATIONS) return null
    velocityY += 1
    // console.log('trying max velocityY:', velocityY)
    const r = calculateTrajectorySteps(velocityX, velocityY, targetArea)
    // console.log('max velocityY', { velocityX, velocityY, ...r })
    if (r.ok) {
      rs.push({ velocityX, velocityY, ...r })
    } else {
      break
    }
  }
  // const maxVelocityY = velocityY
  // console.log({ minVelocityY, maxVelocityY })
  // return { minVelocityY, maxVelocityY }
  const best = rs.reduce((acc, r) => !acc || r.maxHeight > acc.maxHeight ? r : acc, null)
  return best
}

const part1 = targetArea => {
  const { minVelocityX, maxVelocityX } = findRangeX(targetArea)
  console.log({ minVelocityX, maxVelocityX })
  const bests = []
  // for (let velocityX = minVelocityX; velocityX <= maxVelocityX; velocityX++) {
  for (let velocityX = 1; velocityX <= 250; velocityX++) {
    const best = findRangeY(velocityX, targetArea)
    if (best) {
      bests.push(best)
    }
  }
  console.dir(bests)
  if (bests.length === 0) {
    console.log('NO BEST FOUND')
    return
  }
  const sorted = bests.sort((a, b) => b.maxHeight - a.maxHeight)
  const best = sorted[0]
  console.log('Answer (part1):', best.maxHeight)
}

const main = async () => {
  // target area: x=20..30, y=-10..-5
  const example = { left: 20, right: 30, bottom: -10, top: -5 }

  // target area: x=257..286, y=-101..-57
  const input = { left: 257, right: 286, bottom: -101, top: -57 }

  // part1(example)

  // 1176: too low
  // 1225: too low
  part1(input)
}

main()
