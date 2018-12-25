const test = require('ava')
const execa = require('execa')
const semver = require('semver')

test('it shows a valid version when passing -v', async t => {
	const {stdout: actual} = await execa('./cli.js', ['-v'])
	t.is(actual, semver.valid(actual))
})

test('it shows a valid version when passing --version', async t => {
	const {stdout: actual} = await execa('./cli.js', ['--version'])
	t.is(actual, semver.valid(actual))
})
