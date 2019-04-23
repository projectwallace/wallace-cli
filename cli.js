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
		$ echo 'html { font-size: 16px; }' | wallace
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

function filterOutput(config, output) {
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

function formatOutput(output, format, config) {
	format = format.toLowerCase()

	if (format === FORMATS.JSON) {
		return JSON.stringify(output, null, 2)
	}

	return tableify(output, config)
}

async function getCss(input) {
	if (!isAbsoluteUrl(input)) {
		return input
	}

	const spinner = ora('Fetching CSS ...').start()
	const {body: css} = await got(`https://extract-css.now.sh/${input}`, {
		responseType: 'text',
		resolveBodyOnly: true,
		headers: {
			'User-Agent': `WallaceCLI/${
				cli.pkg.version
			} (+https://github.com/bartveneman/wallace-cli)`
		}
	}).finally(spinner.stop())

	return css
}

Promise.resolve()
	// Get the correct input source (as argument or via STDIN)
	.then(() => (input ? input : getStdin()))
	// Optionally get CSS from a remote source
	.then(input => getCss(input))
	// Convert input CSS to stats
	.then(css => analyzeCss(css))
	// Filter some stats if the --compact option is used
	.then(stats => filterOutput({compact: cli.flags.compact}, stats))
	// Format the stats according to the optional --format option
	.then(stats => formatOutput(stats, cli.flags.format))
	// Put the output on the screen
	.then(output => console.log(output))
	// Catch error and exit with non-zero code to indicate error
	.catch(error => {
		console.error(error.toString())
		process.exit(1)
	})
