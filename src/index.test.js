import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import * as fs from 'fs'
import { Program } from './program.js'
import { help } from './help.js'

const cssFixture = fs.readFileSync('./src/__fixtures__/small.css', 'utf-8')
const resultFixture = fs.readFileSync('./src/__fixtures__/small.txt', 'utf-8')
const resultJson = fs.readFileSync('./src/__fixtures__/small.json', 'utf-8')

const terminalColors = {
  bold: str => str,
  dim: str => str,
  underline: str => str,
  italic: str => str,
}

const CLI = suite('CLI')

CLI('wallace (no stdIn + no args)', async () => {
  const actual = await Program({
    args: [],
    readFile: () => Promise.resolve(),
    terminalColors,
    stdIn: '',
  })
  const expected = help(terminalColors)

  assert.equal(actual, expected)
})

CLI('cat style.css | wallace', async () => {
  const actual = await Program({
    args: [],
    readFile: undefined,
    terminalColors,
    stdIn: cssFixture,
  })

  assert.equal(actual, resultFixture.trim())
})

CLI('cat style.css | wallace --json', async () => {
  const actual = await Program({
    args: ['--json'],
    readFile: undefined,
    terminalColors,
    stdIn: cssFixture,
  })

  assert.equal(actual, resultJson.trim())
})

CLI('cat style.css | wallace --help', async () => {
  const actual = await Program({
    args: ['--help'],
    readFile: Promise.resolve,
    terminalColors: terminalColors,
    stdIn: cssFixture,
  })
  const expected = help(terminalColors)

  assert.equal(actual, expected)
})

CLI('cat style.css | wallace -h', async () => {
  const actual = await Program({
    args: ['-h'],
    readFile: Promise.resolve,
    terminalColors: terminalColors,
    stdIn: cssFixture,
  })
  const expected = help(terminalColors)

  assert.equal(actual, expected)
})

CLI('wallace non-existing.css', async () => {
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

CLI('wallace style.css', async () => {
  const actual = await Program({
    args: ['style.css'],
    readFile: () => Promise.resolve(cssFixture),
    terminalColors,
    stdIn: '',
  })

  assert.equal(actual, resultFixture.trim())
})

CLI('wallace style.css --json', async () => {
  const actual = await Program({
    args: ['style.css', '--json'],
    readFile: () => Promise.resolve(cssFixture),
    terminalColors,
    stdIn: '',
  })

  assert.equal(actual, resultJson.trim())
})

CLI('wallace style.css --help', async () => {
  const actual = await Program({
    args: ['style.css', '--help'],
    readFile: () => Promise.resolve(cssFixture),
    terminalColors: terminalColors,
    stdIn: '',
  })
  const expected = help(terminalColors)

  assert.equal(actual, expected)
})

CLI('wallace style.css -h', async () => {
  const actual = await Program({
    args: ['style.css', '-h'],
    readFile: () => Promise.resolve(cssFixture),
    terminalColors: terminalColors,
    stdIn: '',
  })
  const expected = help(terminalColors)

  assert.equal(actual, expected)
})

CLI.run()
