#!/usr/bin/env node
'use strict'

const meow = require('meow')
const analyzeCss = require('@projectwallace/css-analyzer')
const getStdin = require('get-stdin')
const updateNotifier = require('update-notifier')
const importJsx = require('import-jsx')
const getCss = require('./get-css')

// CONFIG
const FORMATS = {
	JSON: 'json',
	PRETTY: 'pretty'
}

const cli = meow(
	`
	Usage
		$ wallace https://www.projectwallace.com

	Options
		--format, -f Format pretty (default) or JSON
		--verbose, -v Show verbose output

	Examples
		$ wallace https://projectwallace.com
		$ wallace 'body { color: red; }'
		$ echo 'html { font-size: 16px; }' | wallace
		$ wallace 'html {}' --format=json
		$ cat style.css | wallace --verbose

`,
	{
		flags: {
			format: {
				type: 'string',
				default: FORMATS.PRETTY,
				alias: 'f'
			},
			verbose: {
				type: 'boolean',
				default: null,
				alias: 'v'
			}
		}
	}
)

updateNotifier({
	pkg: cli.pkg,
	shouldNotifyInNpmScript: true,
	isGlobal: cli.pkg.preferGlobal
}).notify()

const [input] = cli.input
const wallaceCli = importJsx('./components/wallace-cli')

if (!input && process.stdin.isTTY) {
	cli.showHelp()
}

Promise.resolve()
	.then(() => input || getStdin())
	.then(input => getCss(input))
	.then(analyzeCss)
	.then(stats => {
		if (cli.flags.format.toLowerCase() === FORMATS.JSON.toLowerCase()) {
			return console.log(JSON.stringify(stats))
		}

		return wallaceCli({
			stats,
			cliOptions: cli.flags
		})
	})
	.catch(error => {
		console.error(error.toString())
		process.exit(1)
	})
