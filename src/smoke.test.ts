import { describe, it, expect } from 'vitest'
import { readFile } from 'node:fs/promises'
import { analyze } from '@projectwallace/css-analyzer'
import { Analytics } from './components.js'
// import { writeFileSync } from 'node:fs'

const terminal_colors = {
	bold: (str: string) => str,
	dim: (str: string) => str,
	underline: (str: string) => str,
	italic: (str: string) => str,
	red: (str: string) => str,
}

describe('Smoke Tests', () => {
	Object.entries({
		'Bol.com': 'bol-dot-com',
		'CSS Tricks': 'css-tricks',
		CNN: 'cnn',
		'Smashing Magazine': 'smashing-magazine',
	}).map(([name, fileName]) => {
		it(name, async () => {
			const [css, expected] = await Promise.all([
				readFile(`./src/__fixtures__/${fileName}.css`, 'utf-8'),
				readFile(`./src/__fixtures__/${fileName}.txt`, 'utf-8'),
			])
			const stats = analyze(css)
			const actual = Analytics(stats, terminal_colors)
			// writeFileSync(`./src/__fixtures__/${fileName}.txt`, actual)
			expect(actual).toEqual(expected)
		})
	})
})
