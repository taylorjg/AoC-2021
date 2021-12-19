const fs = require('fs').promises

const isRoot = n => !n.parent
const isRegular = n => Number.isInteger(n)
const isNode = n => !isRegular(n)

const findNodeWithRegular = n => {
  if (isRegular(n.left) || isRegular(n.right)) {
    return n
  }
  if (isNode(n.left)) {
    const n2 = findNodeWithRegular(n.left)
    if (n2) return n2
  }
  if (isNode(n.right)) {
    const n2 = findNodeWithRegular(n.right)
    if (n2) return n2
  }
  return null
}

const canReachNodeFollowingLeftPath = (n1, n2) => {
  if (isRegular(n1.left)) return false
  if (n1.left === n2) return true
  return canReachNodeFollowingLeftPath(n1.left, n2)
}

const canReachNodeFollowingRightPath = (n1, n2) => {
  if (isRegular(n1.right)) return false
  if (n1.right === n2) return true
  return canReachNodeFollowingRightPath(n1.right, n2)
}

const findBranchPointLeft = n => {
  let current = n
  for (; ;) {
    if (isRoot(current)) {
      if (canReachNodeFollowingLeftPath(current, n)) return null
      return current
    }
    current = current.parent
    if (!canReachNodeFollowingLeftPath(current, n)) return current
  }
}

const findBranchPointRight = n => {
  let current = n
  for (; ;) {
    if (isRoot(current)) {
      if (canReachNodeFollowingRightPath(current, n)) return null
      return current
    }
    current = current.parent
    if (!canReachNodeFollowingRightPath(current, n)) return current
  }
}

const findLeftNodeWithRegular = n => {
  const branchNode = findBranchPointLeft(n)
  if (!branchNode) return null
  if (isRegular(branchNode.left)) return branchNode
  return findNodeWithRegular(branchNode.left)
}

const findRightNodeWithRegular = n => {
  const branchNode = findBranchPointRight(n)
  if (!branchNode) return null
  if (isRegular(branchNode.right)) return branchNode
  return findNodeWithRegular(branchNode.right)
}

const explode = number => {

  const leftNodeWithRegular = findLeftNodeWithRegular(number)
  const rightNodeWithRegular = findRightNodeWithRegular(number)

  if (leftNodeWithRegular) {
    if (isRegular(leftNodeWithRegular.left)) {
      leftNodeWithRegular.left += number.left
    } else {
      leftNodeWithRegular.right += number.left
    }
  }

  if (rightNodeWithRegular) {
    if (isRegular(rightNodeWithRegular.left)) {
      rightNodeWithRegular.left += number.right
    } else {
      rightNodeWithRegular.right += number.right
    }
  }

  if (number.parent) {
    if (number.parent.left === number) {
      number.parent.left = 0
    }
    if (number.parent.right === number) {
      number.parent.right = 0
    }
  }
}

const splitLeft = n => {
  const left = Math.floor(n.left / 2)
  const right = Math.ceil(n.left / 2)
  n.left = { parent: n, left, right }
}

const splitRight = n => {
  const left = Math.floor(n.right / 2)
  const right = Math.ceil(n.right / 2)
  n.right = { parent: n, left, right }
}

// To reduce a snailfish number, you must repeatedly do the first action in
// this list that applies to the snailfish number:
//
//  If any pair is nested inside four pairs, the leftmost such pair explodes.
//
//  If any regular number is 10 or greater, the leftmost such regular number splits.
const reduce = number => {

  const reduceOneStep = (n, level) => {
    if (isRegular(n)) return false
    if (level === 4) {
      explode(n)
      return true
    }
    if (isRegular(n.left) && n.left >= 10) {
      splitLeft(n)
      return true
    }
    if (isRegular(n.right) && n.right >= 10) {
      splitRight(n)
      return true
    }
    if (reduceOneStep(n.left, level + 1)) {
      return true
    }
    return reduceOneStep(n.right, level + 1)
  }

  for (; ;) {
    const reduced = reduceOneStep(number, 0)
    if (!reduced) break
  }
}

const add = (a, b) => {
  const c = { left: a, right: b }
  c.left.parent = c
  c.right.parent = c
  reduce(c)
  return c
}

const magnitude = number => {
  if (Number.isInteger(number)) return number
  return 3 * magnitude(number.left) + 2 * magnitude(number.right)
}

const part1 = numbers => {
  const total = numbers.reduce(add)
  console.dir(total, { depth: null })
  const answer = magnitude(total)
  console.log('Answer (part1):', answer)
}

const parseNumber = line => {

  const helper = (nodes, s) => {
    const [ch, ...remainder] = s
    switch (ch) {
      case '[': {
        const node = {}
        if (nodes.length) {
          node.parent = nodes[nodes.length - 1]
        }
        nodes.push(node)
        const result = helper(nodes, remainder)
        node.left = result.node
        return helper(nodes, result.remainder)
      }
      case ',': {
        const node = nodes[nodes.length - 1]
        const result = helper(nodes, remainder)
        node.right = result.node
        return helper(nodes, result.remainder)
      }
      case ']': {
        const node = nodes.pop()
        return { node, remainder }
      }
      default: {
        const node = Number(ch)
        return { node, remainder }
      }
    }
  }

  const result = helper([], line)
  return result.node
}

const formatNumber = n => {
  let s = ''
  const helper = n => {
    if (isRegular(n)) {
      s += n
    } else {
      s += '['
      helper(n.left)
      s += ','
      helper(n.right)
      s += ']'
    }
  }
  helper(n)
  return s
}

const main = async () => {
  // const buffer = await fs.readFile('day18/example2.txt')
  // // const buffer = await fs.readFile('day18/input.txt')
  // const lines = buffer.toString().split('\n').filter(Boolean)
  // const numbers = lines.map(parseNumber)
  // part1(numbers)
  const number = parseNumber('[[[9,[3,8]],[[0,9],6]],[[[3,7],[4,9]],3]]')
  console.dir(number, { depth: null })
  console.dir(formatNumber(number))
}

main()
