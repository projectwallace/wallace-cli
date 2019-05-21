#!/usr/bin/env node
'use strict'

const meow = require('meow')
const analyzeCss = require('@projectwallace/css-analyzer')
const getStdin = require('get-stdin')
const isAbsoluteUrl = require('is-absolute-url')
const got = require('got')
const updateNotifier = require('update-notifier')

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

const [input] = cli.input

if (!input && process.stdin.isTTY) {
	cli.showHelp()
}

const getCss = async input => {
	if (!isAbsoluteUrl(input)) {
		return input
	}

	const {body} = await got(`https://extract-css.now.sh/${input}`, {
		responseType: 'text',
		resolveBodyOnly: true,
		headers: {
			'User-Agent': `WallaceCli/${cli.pkg.version} (+${cli.pkg.repository.url})`
		}
	})

	return body
}

const WallaceCli = require('import-jsx')('./components/WallaceCli.js')

Promise.resolve()
	.then(() => input || getStdin())
	.then(getCss)
	.then(analyzeCss)
	.then(stats => WallaceCli({stats, cliOptions: cli.flags}))
	.then(() => input || getStdin())
	.catch(error => {
		console.error(error.toString())
		process.exit(1)
	})
