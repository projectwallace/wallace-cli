import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import * as fs from 'fs'
import { analyze } from '@projectwallace/css-analyzer'
import { Analytics } from './components.js'

const terminalColors = {
  bold: str => str,
  dim: str => str,
  underline: str => str,
}

const Smoke = suite('Smoke Tests')

Object.entries({
  'Bol.com': 'bol-dot-com',
  'CSS Tricks': 'css-tricks',
  'CNN': 'cnn',
  'Smashing Magazine': 'smashing-magazine',
}).map(([name, fileName]) => {
  Smoke(name, () => {
    const css = fs.readFileSync(`./src/__fixtures__/${fileName}.css`, 'utf-8')
    const expected = fs.readFileSync(`./src/__fixtures__/${fileName}.txt`, 'utf-8')
    const stats = analyze(css)
    const actual = Analytics(stats, terminalColors)
    // fs.writeFileSync(`./src/__fixtures__/${fileName}.txt`, actual)
    assert.equal(actual, expected)
  })
})

Smoke.run()
