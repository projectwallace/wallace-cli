import { defineConfig } from 'tsdown'

export default defineConfig({
	entry: ['src/bin.ts'],
	format: 'esm',
	platform: 'node',
	deps: {
		neverBundle: ['@projectwallace/css-analyzer'],
	},
	publint: true,
})
