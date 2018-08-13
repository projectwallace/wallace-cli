#!/usr/bin/env node
'use strict'

const meow = require('meow')
const analyzeCss = require('@projectwallace/css-analyzer')
const getStdin = require('get-stdin')
const isAbsoluteUrl = require('is-absolute-url')
const getCss = require('get-css')
const ora = require('ora')
const flatten = require('flat')
const tableify = require('./table.js')

// CONFIG
const FORMATS = {
	JSON: 'json',
	PRETTY: 'pretty'
}

const cli = meow(`
	Usage
		$ wallace https://projectwallace.com

	Options
		--format, -f Format pretty (default) or JSON
		--compact, -c Show a compact output

	Examples
		$ wallace https://projectwallace.com
		$ wallace 'body { color: red; }'
		$ echo 'html { font-size: 16px; } | wallace
		$ wallace 'html {}' --format=json
		$ cat style.css | wallace --compact

`, {
	flags: {
		format: {
			type: 'string',
			default: FORMATS.PRETTY,
			alias: 'f'
		},
		compact: {
			type: 'boolean',
			default: null,
			alias: 'c'
		}
	}
})

const input = cli.input[0]

if (!input && process.stdin.isTTY) {
	console.log('Specify something to analyze')
	process.exit(1)
}

const filterOutput = (config, output) => {
	if (config.compact) {
		return Object.entries(output).reduce((acc, [key, value]) => {
			if (!key.includes('unique') && !key.includes('top')) {
				acc[key] = value
			}
			return acc
		}, {})
	}

	return output
}

const formatOutput = (format, output, config) => {
	switch (format) {
		case FORMATS.JSON:
			return JSON.stringify(output, null, 2)
		case FORMATS.PRETTY:
		default:
			return tableify(output, config)
	}
}

const fetchCssFromUrl = async url => {
	return (await getCss(url, {
		headers: {'User-Agent': 'Project Wallace CSS Analyzer CLI'}
	})).css
}

const processStats = async input => {
	const spinner = ora('Starting analysis...').start()

	if (isAbsoluteUrl(input)) {
		spinner.text = 'Fetching CSS...'
		input = await fetchCssFromUrl(input)
	}

	const stats = await analyzeCss(input)
	const flattened = flatten(stats, {safe: true})
	const filtered = filterOutput({compact: cli.flags.compact}, flattened)
	const format = FORMATS[cli.flags.format.toUpperCase()] ? cli.flags.format : FORMATS.PRETTY
	const output = formatOutput(format, filtered, {compact: cli.flags.compact})

	spinner.stop()
	console.log(output)
}

// Read input as argument or from STDIN
if (input) {
	processStats(input)
} else {
	getStdin().then(input => processStats(input))
}
