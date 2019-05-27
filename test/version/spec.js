const test = require('ava')
const execa = require('execa')
const semver = require('semver')

test('it shows a valid version when passing --version', async t => {
	const {stdout: actual} = await execa('./src/cli.js', ['--version'])
	t.is(actual, semver.valid(actual))
})
