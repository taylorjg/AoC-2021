const fs = require('fs').promises
const R = require('ramda')

const sum = xs => xs.reduce((a, b) => a + b, 0)

const hexCharToInt = ch => parseInt(ch, 16)

const intToBinaryString = n => n.toString(2).padStart(4, '0')

const hexStringToBinaryString = s =>
  Array.from(s).map(ch => intToBinaryString(hexCharToInt(ch))).join('')

const parseLiteralPacket = binaryString => {
  let numberString = ''
  let currentIndex = 6
  for (; ;) {
    const fiveBits = binaryString.slice(currentIndex, currentIndex + 5)
    currentIndex += 5
    const fourBits = fiveBits.slice(1)
    numberString += fourBits
    if (fiveBits[0] === '0') break
  }
  const literal = parseInt(numberString, 2)
  return { literal, length: currentIndex }
}

const parseOperatorPacket = binaryString => {
  const lengthBit = binaryString.slice(6, 7)
  if (lengthBit === '0') {
    const lengthInBits = parseInt(binaryString.slice(7, 7 + 15), 2)
    console.log('operator', { lengthBit, lengthInBits })
    let remainder = binaryString.slice(7 + 15, 7 + 15 + lengthInBits)
    for (; ;) {
      const len = parsePacket(remainder)
      remainder = remainder.slice(len)
      if (remainder === '' || Array.from(remainder).every(ch => ch === '0')) {
        break
      }
    }
    return 7 + 15 + lengthInBits
  } else {
    const lengthInSubPackets = parseInt(binaryString.slice(7, 7 + 11), 2)
    console.log('operator', { lengthBit, lengthInSubPackets })
    let lengthInBits = 0
    let remainder = binaryString.slice(7 + 11)
    for (; ;) {
      const len = parsePacket(remainder)
      lengthInBits += len
      remainder = remainder.slice(len)
      if (remainder === '' || Array.from(remainder).every(ch => ch === '0')) {
        break
      }
    }
    return 7 + 11 + lengthInBits
  }
}

const parsePacket = binaryString => {
  const version = parseInt(binaryString.slice(0, 3), 2)
  const typeId = parseInt(binaryString.slice(3, 6), 2)
  console.log({ version, typeId })
  if (typeId === 4) {
    const { literal, length } = parseLiteralPacket(binaryString)
    console.log('literal', { literal, length })
    return length
  } else {
    return parseOperatorPacket(binaryString)
  }
}

const part1 = packet => {
  let binaryString = hexStringToBinaryString(packet)
  console.log(binaryString)
  parsePacket(binaryString)
  console.log('Answer (part1):', 0)
}

const main = async () => {
  const buffer = await fs.readFile('day16/input.txt')
  const packet = buffer.toString().split('\n')[0]
  console.dir(packet)
  // part1('D2FE28')
  // part1('38006F45291200')
  // part1('EE00D40C823060')
  part1('8A004A801A8002F478')
  // part1('620080001611562C8802118E34')
  // part1('C0015000016115A2E0802F182340')
  // part1('A0016C880162017C3686B18A3D4780')
  // part1(packet)
}

main()
