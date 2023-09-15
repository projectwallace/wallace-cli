import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import fs from 'node:fs/promises'
import { Program } from './program.js'
import { help } from './help.js'

const [
  css_fixture,
  cli_fixture,
  result_json,
] = await Promise.all([
  fs.readFile('./src/__fixtures__/small.css', 'utf-8'),
  fs.readFile('./src/__fixtures__/small.txt', 'utf-8'),
  fs.readFile('./src/__fixtures__/small.json', 'utf-8')
])
const result = JSON.parse(result_json)

const terminal_colors = {
  bold: str => str,
  dim: str => str,
  underline: str => str,
  italic: str => str,
}

const ProgramSuite = suite('Program')

ProgramSuite('wallace (no stdIn + no args)', async () => {
  const actual = await Program({
    args: [],
    read_file: () => Promise.resolve(),
    terminal_colors,
    stdin: '',
  })
  const expected = help(terminal_colors)

  assert.equal(actual, expected)
})

ProgramSuite('cat style.css | wallace --help', async () => {
  const actual = await Program({
    args: ['--help'],
    read_file: Promise.resolve,
    terminal_colors: terminal_colors,
    stdin: css_fixture,
  })
  const expected = help(terminal_colors)

  assert.equal(actual, expected)
})

ProgramSuite('wallace style.css --help', async () => {
  const actual = await Program({
    args: ['style.css', '--help'],
    read_file: () => Promise.resolve(css_fixture),
    terminal_colors: terminal_colors,
    stdin: '',
  })
  const expected = help(terminal_colors)

  assert.equal(actual, expected)
})

ProgramSuite('cat style.css | wallace -h', async () => {
  const actual = await Program({
    args: ['-h'],
    read_file: Promise.resolve,
    terminal_colors: terminal_colors,
    stdin: css_fixture,
  })
  const expected = help(terminal_colors)

  assert.equal(actual, expected)
})

ProgramSuite('wallace style.css -h', async () => {
  const actual = await Program({
    args: ['style.css', '-h'],
    read_file: () => Promise.resolve(css_fixture),
    terminal_colors: terminal_colors,
    stdin: '',
  })
  const expected = help(terminal_colors)

  assert.equal(actual, expected)
})

ProgramSuite('cat style.css | wallace', async () => {
  const actual = await Program({
    args: [],
    read_file: Promise.resolve,
    terminal_colors,
    stdin: css_fixture,
  })

  assert.is(actual, cli_fixture.trim())
})

ProgramSuite('cat style.css | wallace --json', async () => {
  const actual = await Program({
    args: ['--json'],
    read_file: Promise.resolve,
    terminal_colors,
    stdin: css_fixture,
  })

  assert.equal(JSON.parse(actual), result)
})

ProgramSuite('wallace non-existing.css', async () => {
  try {
    await Program({
      args: ['non-existing.css'],
      read_file: () => Promise.reject(new Error()),
      terminal_colors,
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
    read_file: () => Promise.resolve(css_fixture),
    terminal_colors,
    stdin: '',
  })

  assert.is(actual, cli_fixture.trim())
})

ProgramSuite('wallace style.css --json', async () => {
  const actual = await Program({
    args: ['style.css', '--json'],
    read_file: () => Promise.resolve(css_fixture),
    terminal_colors,
    stdin: '',
  })

  assert.equal(JSON.parse(actual), result)
})

ProgramSuite.run()
