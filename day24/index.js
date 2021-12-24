const fs = require('fs').promises

const parseInstruction = line => {
  const bits = line.split(/\s+/)
  const opcode = bits[0]
  const a = bits[1]
  if (opcode === 'inp') {
    return { opcode, a }
  } else {
    const bn = Number(bits[2])
    const b = Number.isInteger(bn) ? bn : bits[2]
    return { opcode, a, b }
  }
}

const processInstruction = (variables, instruction, inputs) => {
  if (instruction.opcode === 'inp') {
    variables.set(instruction.a, Number(inputs.shift()))
    return
  }
  const { opcode, a, b } = instruction
  const av = variables.get(a)
  const bv = Number.isInteger(b) ? b : variables.get(b)
  switch (opcode) {
    case 'add': {
      variables.set(a, av + bv)
      break
    }
    case 'mul': {
      variables.set(a, av * bv)
      break
    }
    case 'div': {
      if (bv === 0) throw new Error('[div] b=0')
      variables.set(a, Math.trunc(av / bv))
      break
    }
    case 'mod': {
      if (av < 0) throw new Error('[mod] a<0')
      if (bv <= 0) throw new Error('[mod] b<=0')
      variables.set(a, av % bv)
      break
    }
    case 'eql': {
      variables.set(a, av === bv ? 1 : 0)
      break
    }
  }
}

const processInstructions = (instructions, inputs) => {
  const variables = new Map([
    ['w', 0],
    ['x', 0],
    ['y', 0],
    ['z', 0]
  ])
  instructions.forEach(instruction => processInstruction(variables, instruction, inputs))
  return variables
}

const part1 = instructions => {
  const subprograms = []
  let subprogram = []
  for (const instruction of instructions) {
    if (instruction.opcode === 'inp') {
      if (subprogram.length) {
        subprograms.push(subprogram)
        subprogram = []
      }
    }
    subprogram.push(instruction)
  }
  if (subprogram.length) {
    subprograms.push(subprogram)
  }
  console.log('subprograms.length:', subprograms.length)
  subprograms.forEach((subprogram, index) => {
    if (index > 0) console.log('-'.repeat(40))
    for (const digit of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
      try {
        const vs = processInstructions(subprogram, [digit])
        console.log(`subprograms[${index}] digit: ${digit}; vs: ${JSON.stringify(Array.from(vs.entries()))}}`)
      } catch {
        console.log(`subprograms[${index}] digit: ${digit}; BOOM!`)
      }
    }
  })
}

const main = async () => {
  // const buffer = await fs.readFile('day24/example1.txt')
  // const buffer = await fs.readFile('day24/example2.txt')
  // const buffer = await fs.readFile('day24/example3.txt')
  const buffer = await fs.readFile('day24/input.txt')
  const lines = buffer.toString().split('\n').filter(Boolean)
  const instructions = lines.map(parseInstruction)
  part1(instructions)
}

main()
