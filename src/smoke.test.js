const { suite } = require('uvu')
const assert = require('uvu/assert')
const fs = require('fs')
const { analyze } = require('@projectwallace/css-analyzer')
const { Analytics } = require('./components.js')

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
