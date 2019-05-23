#!/usr/bin/env node
'use strict'

const meow = require('meow')
const analyzeCss = require('@projectwallace/css-analyzer')
const getStdin = require('get-stdin')
const updateNotifier = require('update-notifier')
const getCss = require('./get-css')

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

const USER_AGENT = `WallaceCli/${cli.pkg.version} (+${cli.pkg.repository.url})`

const [input] = cli.input

if (!input && process.stdin.isTTY) {
	cli.showHelp()
}

const WallaceCli = require('import-jsx')('./components/WallaceCli.js')

Promise.resolve()
	.then(() => input || getStdin())
	.then(input => getCss(input, {userAgent: USER_AGENT}))
	.then(analyzeCss)
	.then(stats => WallaceCli({stats, cliOptions: cli.flags}))
	.then(() => input || getStdin())
	.catch(error => {
		console.error(error.toString())
		process.exit(1)
	})
