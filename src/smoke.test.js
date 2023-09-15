import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { readFile } from 'node:fs/promises'
import { analyze } from '@projectwallace/css-analyzer'
import { Analytics } from './components.js'

const terminal_colors = {
  bold: str => str,
  dim: str => str,
  underline: str => str,
  red: str => str,
}

const Smoke = suite('Smoke Tests')

Object.entries({
  'Bol.com': 'bol-dot-com',
  'CSS Tricks': 'css-tricks',
  'CNN': 'cnn',
  'Smashing Magazine': 'smashing-magazine',
}).map(([name, fileName]) => {
  Smoke(name, async () => {
    const [css, expected] = await Promise.all([
      readFile(`./src/__fixtures__/${fileName}.css`, 'utf-8'),
      readFile(`./src/__fixtures__/${fileName}.txt`, 'utf-8'),
    ])
    const stats = analyze(css)
    const actual = Analytics(stats, terminal_colors)
    // fs.writeFileSync(`./src/__fixtures__/${fileName}.txt`, actual)
    assert.equal(actual, expected)
  })
})

Smoke.run()
