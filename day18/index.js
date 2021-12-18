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

  if (number.parent.left === number) {
    number.parent.left = 0
  }

  if (number.parent.right === number) {
    number.parent.right = 0
  }
}

const split = number => {
  const left = Math.floor(number / 2)
  const right = Math.ceil(number / 2)
  return { left, right }
}

// To reduce a snailfish number, you must repeatedly do the first action in
// this list that applies to the snailfish number:
//
//  If any pair is nested inside four pairs, the leftmost such pair explodes.
//
//  If any regular number is 10 or greater, the leftmost such regular number splits.
const reduce = number => {
  const descend = (n, level) => {
    if (Number.isInteger(n)) return false
    // if (Number.isInteger(n)) {
    //   if (n >= 10) {
    //     // make change
    //     return true
    //   }
    // }
    if (level === 4) {
      explode(n)
      return true
    } else {
      if (descend(n.left, level + 1)) return true
      return descend(n.right, level + 1)
    }
  }
  descend(number, 0)
}

const add = (a, b) => {
  const number = { left: a, right: b }
  return reduce(number)
}

const magnitude = number => {
  if (Number.isInteger(number)) return number
  return 3 * magnitude(number.left) + 2 * magnitude(number.right)
}

const part1 = numbers => {
  const total = numbers.reduce(add)
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

const main = async () => {
  // const buffer = await fs.readFile('day18/example1.txt')
  // // const buffer = await fs.readFile('day18/input.txt')
  // const lines = buffer.toString().split('\n').filter(Boolean)
  // const numbers = lines.map(parseNumber)
  // console.dir(numbers, { depth: null })
  // part1(numbers)
  // const number = parseNumber('[[[[[9,8],1],2],3],4]')
  // const number = parseNumber('[7,[6,[5,[4,[3,2]]]]]')
  // const number = parseNumber('[[6,[5,[4,[3,2]]]],1]')
  // const number = parseNumber('[[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]]')
  const number = parseNumber('[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]')
  // console.dir(number.right.right.right.right)
  // explode(number.right.right.right.right)
  reduce(number)
  console.dir(number, { depth: null })
  // console.dir(split(parseNumber('')))
  // console.dir(reduce(parseNumber('')))
}

main()
