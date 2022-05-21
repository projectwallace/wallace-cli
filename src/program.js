const { analyze } = require('@projectwallace/css-analyzer')
const { help } = require('./help')
const { Analytics } = require('./components')

exports.Program = async function Program({ args, readFile, terminalColors, stdIn }) {
  const formatAsJson = '--json'
  const helpArgs = ['-h', '--help']

  // Show help if the user explicitly asked for it
  if (args.some(arg => helpArgs.includes(arg))
    // Show help if there's no input and no arguments provided
    || args.length === 0 && stdIn === '') {
    return help(terminalColors)
  }

  const pathParam = args.find(arg => arg !== formatAsJson && !helpArgs.includes(arg))
  const css = pathParam ? await readFile(pathParam) : stdIn
  const stats = analyze(css)

  // Format as JSON is user asked for it
  if (args.some(arg => arg === formatAsJson)) {
    delete stats.__meta__
    return JSON.stringify(stats)
  }

  return Analytics(stats, terminalColors)
}