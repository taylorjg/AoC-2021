const MAX_ITERATIONS = 1000

const withinTargetArea = (x, y, targetArea) => (
  x >= targetArea.left &&
  x <= targetArea.right &&
  y <= targetArea.top &&
  y >= targetArea.bottom
)

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

const calculateTrajectorySteps2 = (velocityX, velocityY, targetArea) => {
  let steps = 0
  let currentX = 0
  let currentY = 0
  for (; ;) {
    if (steps++ > MAX_ITERATIONS) break
    currentX += velocityX
    currentY += velocityY
    if (withinTargetArea(currentX, currentY, targetArea)) {
      return true
    }
    if (velocityX > 0) {
      velocityX -= 1
    } else {
      if (velocityX < 0) {
        velocityX += 1
      }
    }
    velocityY -= 1
  }
  return false
}

const part1 = targetArea => {
  const results = []
  for (let velocityX = 1; velocityX <= 250; velocityX++) {
    for (let velocityY = 1; velocityY < 250; velocityY++) {
      const result = calculateTrajectorySteps(velocityX, velocityY, targetArea)
      if (result.ok) {
        results.push({ velocityX, velocityY, ...result })
      }
    }
  }
  const sorted = results.sort((a, b) => b.maxHeight - a.maxHeight)
  const best = sorted[0]
  console.log('Answer (part1):', best.maxHeight)
}

const part2 = targetArea => {
  let hits = 0
  for (let velocityX = 1; velocityX <= 500; velocityX++) {
    for (let velocityY = -500; velocityY <= 500; velocityY++) {
      const ok = calculateTrajectorySteps2(velocityX, velocityY, targetArea)
      if (ok) hits++
    }
  }
  console.log('Answer (part2):', hits)
}

const main = async () => {
  // target area: x=20..30, y=-10..-5
  const example = { left: 20, right: 30, bottom: -10, top: -5 }

  // target area: x=257..286, y=-101..-57
  const input = { left: 257, right: 286, bottom: -101, top: -57 }

  part1(example)
  part1(input)

  part2(example)
  part2(input)
}

main()
