#!/usr/bin/env node
'use strict'

const meow = require('meow')
const analyzeCss = require('@projectwallace/css-analyzer')
const getStdin = require('get-stdin')
const isAbsoluteUrl = require('is-absolute-url')
const got = require('got')
const ora = require('ora')
const updateNotifier = require('update-notifier')
const tableify = require('./table.js')

// CONFIG
const FORMATS = {
	JSON: 'json',
	PRETTY: 'pretty'
}

const cli = meow(
	`
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

`,
	{
		flags: {
			version: {
				alias: 'v'
			},
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
	}
)

updateNotifier({
	pkg: cli.pkg,
	shouldNotifyInNpmScript: true,
	isGlobal: cli.pkg.preferGlobal
}).notify()

const input = cli.input[0]

if (!input && process.stdin.isTTY) {
	cli.showHelp()
}

const filterOutput = (config, output) => {
	if (!config.compact) {
		return output
	}

	return Object.entries(output).reduce((acc, [key, value]) => {
		if (
			!key.includes('unique') &&
			!key.includes('top') &&
			!key.includes('duplicates')
		) {
			acc[key] = value
		}

		return acc
	}, {})
}

const formatOutput = (format, output, config) => {
	format = format.toLowerCase()

	if (format === FORMATS.JSON) {
		return JSON.stringify(output, null, 2)
	}

	return tableify(output, config)
}

const processStats = async input => {
	const spinner = ora('Starting analysis...').start()

	if (isAbsoluteUrl(input)) {
		spinner.text = 'Fetching CSS...'
		const {body: css} = await got(`https://extract-css.now.sh/${input}`, {
			responseType: 'text',
			resolveBodyOnly: true,
			headers: {
				'User-Agent': `WallaceCLI/${
					cli.pkg.version
				} (+https://github.com/bartveneman/wallace-cli)`
			}
		})
		input = css
	}

	const stats = await analyzeCss(input)
	const filtered = filterOutput({compact: cli.flags.compact}, stats)
	const format = FORMATS[cli.flags.format.toUpperCase()]
		? cli.flags.format
		: FORMATS.PRETTY
	const output = formatOutput(format, filtered, {compact: cli.flags.compact})

	spinner.stop()
	console.log(output)
}

// Read input as argument or from STDIN
if (input) {
	processStats(input)
} else {
	;(async () => {
		const css = await getStdin()
		processStats(css)
	})()
}
