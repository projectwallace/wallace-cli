const { suite } = require('uvu')
const assert = require('uvu/assert')
const fs = require('fs')
const { Program } = require('./program.js')
const { help } = require('./help.js')

const cssFixture = fs.readFileSync('./src/__fixtures__/small.css', 'utf-8')
const resultFixture = fs.readFileSync('./src/__fixtures__/small.txt', 'utf-8')
const resultJson = fs.readFileSync('./src/__fixtures__/small.json', 'utf-8')

const terminalColors = {
  bold: str => str,
  dim: str => str,
  underline: str => str,
  italic: str => str,
}

const ProgramSuite = suite('Program')

ProgramSuite('wallace (no stdIn + no args)', async () => {
  const actual = await Program({
    args: [],
    readFile: () => Promise.resolve(),
    terminalColors,
    stdIn: '',
  })
  const expected = help(terminalColors)

  assert.equal(actual, expected)
})

ProgramSuite('cat style.css | wallace', async () => {
  const actual = await Program({
    args: [],
    readFile: undefined,
    terminalColors,
    stdIn: cssFixture,
  })

  assert.equal(actual, resultFixture.trim())
})

ProgramSuite('cat style.css | wallace --json', async () => {
  const actual = await Program({
    args: ['--json'],
    readFile: undefined,
    terminalColors,
    stdIn: cssFixture,
  })

  assert.equal(actual, resultJson.trim())
})

ProgramSuite('cat style.css | wallace --help', async () => {
  const actual = await Program({
    args: ['--help'],
    readFile: Promise.resolve,
    terminalColors: terminalColors,
    stdIn: cssFixture,
  })
  const expected = help(terminalColors)

  assert.equal(actual, expected)
})

ProgramSuite('cat style.css | wallace -h', async () => {
  const actual = await Program({
    args: ['-h'],
    readFile: Promise.resolve,
    terminalColors: terminalColors,
    stdIn: cssFixture,
  })
  const expected = help(terminalColors)

  assert.equal(actual, expected)
})

ProgramSuite('wallace non-existing.css', async () => {
  try {
    await Program({
      args: ['non-existing.css'],
      readFile: () => Promise.reject(new Error()),
      terminalColors,
      stdIn: '',
    })
    assert.unreachable()
  } catch (error) {
    assert.instance(error, Error)
  }
})

ProgramSuite('wallace style.css', async () => {
  const actual = await Program({
    args: ['style.css'],
    readFile: () => Promise.resolve(cssFixture),
    terminalColors,
    stdIn: '',
  })

  assert.equal(actual, resultFixture.trim())
})

ProgramSuite('wallace style.css --json', async () => {
  const actual = await Program({
    args: ['style.css', '--json'],
    readFile: () => Promise.resolve(cssFixture),
    terminalColors,
    stdIn: '',
  })

  assert.equal(actual, resultJson.trim())
})

ProgramSuite('wallace style.css --help', async () => {
  const actual = await Program({
    args: ['style.css', '--help'],
    readFile: () => Promise.resolve(cssFixture),
    terminalColors: terminalColors,
    stdIn: '',
  })
  const expected = help(terminalColors)

  assert.equal(actual, expected)
})

ProgramSuite('wallace style.css -h', async () => {
  const actual = await Program({
    args: ['style.css', '-h'],
    readFile: () => Promise.resolve(cssFixture),
    terminalColors: terminalColors,
    stdIn: '',
  })
  const expected = help(terminalColors)

  assert.equal(actual, expected)
})

ProgramSuite.run()
