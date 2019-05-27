const test = require('ava')
const execa = require('execa')

test('it shows the help if --help is passed', async t => {
	const {stdout} = await execa('./src/cli.js', ['--help'])
	t.snapshot(stdout)
	t.true(stdout.includes('$ wallace https://www.projectwallace.com'))
	t.true(stdout.includes('--format, -f Format pretty (default) or JSON'))
	t.true(stdout.includes('--verbose, -v Show verbose output'))
	t.true(stdout.includes('Examples'))
	t.true(stdout.includes('$ cat style.css | wallace --verbose'))
})
