import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import fs from 'fs'
import { Program } from './program.js'
import { help } from './help.js'

const cssFixture = fs.readFileSync('./src/__fixtures__/small.css', 'utf-8')
const resultFixture = fs.readFileSync('./src/__fixtures__/small.txt', 'utf-8')
const resultJson = JSON.parse(fs.readFileSync('./src/__fixtures__/small.json', 'utf-8'))

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
    stdin: '',
  })
  const expected = help(terminalColors)

  assert.equal(actual, expected)
})

ProgramSuite('cat style.css | wallace --help', async () => {
  const actual = await Program({
    args: ['--help'],
    readFile: Promise.resolve,
    terminalColors: terminalColors,
    stdin: cssFixture,
  })
  const expected = help(terminalColors)

  assert.equal(actual, expected)
})

ProgramSuite('wallace style.css --help', async () => {
  const actual = await Program({
    args: ['style.css', '--help'],
    readFile: () => Promise.resolve(cssFixture),
    terminalColors: terminalColors,
    stdin: '',
  })
  const expected = help(terminalColors)

  assert.equal(actual, expected)
})

ProgramSuite('cat style.css | wallace -h', async () => {
  const actual = await Program({
    args: ['-h'],
    readFile: Promise.resolve,
    terminalColors: terminalColors,
    stdin: cssFixture,
  })
  const expected = help(terminalColors)

  assert.equal(actual, expected)
})

ProgramSuite('wallace style.css -h', async () => {
  const actual = await Program({
    args: ['style.css', '-h'],
    readFile: () => Promise.resolve(cssFixture),
    terminalColors: terminalColors,
    stdin: '',
  })
  const expected = help(terminalColors)

  assert.equal(actual, expected)
})

ProgramSuite('cat style.css | wallace', async () => {
  const actual = await Program({
    args: [],
    readFile: Promise.resolve,
    terminalColors,
    stdin: cssFixture,
  })

  assert.is(actual, resultFixture.trim())
})

ProgramSuite('cat style.css | wallace --json', async () => {
  const actual = await Program({
    args: ['--json'],
    readFile: Promise.resolve,
    terminalColors,
    stdin: cssFixture,
  })

  assert.equal(JSON.parse(actual), resultJson)
})

ProgramSuite('wallace non-existing.css', async () => {
  try {
    await Program({
      args: ['non-existing.css'],
      readFile: () => Promise.reject(new Error()),
      terminalColors,
      stdin: '',
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
    stdin: '',
  })

  assert.is(actual, resultFixture.trim())
})

ProgramSuite('wallace style.css --json', async () => {
  const actual = await Program({
    args: ['style.css', '--json'],
    readFile: () => Promise.resolve(cssFixture),
    terminalColors,
    stdin: '',
  })

  assert.equal(JSON.parse(actual), resultJson)
})

ProgramSuite.run()
