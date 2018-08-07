#!/usr/bin/env node
'use strict'

const meow = require('meow')
const analyzeCss = require('@projectwallace/css-analyzer')
const getStdin = require('get-stdin')
const isAbsoluteUrl = require('is-absolute-url')
const getCss = require('get-css')
const ora = require('ora')
const table = require('./table.js')

const cli = meow(`
	Usage
		$ analyze-css https://projectwallace.com

	Examples
		$ analyze-css https://projectwallace.com
		$ analyze-css 'body { color: red; }'
		$ echo 'html { font-size: 16px; } | analyze-css
`, {
	flags: {
		version: {
			alias: 'v'
		}
	}
})

const input = cli.input[0]

if (!input && process.stdin.isTTY) {
	console.log('Specify something to analyze')
	process.exit(1)
}

const processStats = async (input) => {
	let css
	const spinner = ora({text: 'Wallace wakes up...', color: 'green'}).start()

	if (isAbsoluteUrl(input)) {
		spinner.text = 'Fetching CSS...'
		input = (await getCss(input, {
			headers: {'User-Agent': 'Project Wallace CLI'}
		})).css
		spinner.stop()
	}

	analyzeCss(input).then(stats => {
		spinner.stop()
		console.log(table(stats))
	})
}

if (input) {
	processStats(input)
} else {
	getStdin().then(input => processStats(input))
}
