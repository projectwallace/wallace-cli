import { analyze } from '@projectwallace/css-analyzer'
import { help } from './help.js'
import { Analytics } from './components.js'

export async function Program({ args, readFile, terminalColors, stdin }) {
  const formatAsJson = '--json'
  const helpArgs = ['-h', '--help']

  // Show help if the user explicitly asked for it
  if (args.some(arg => helpArgs.includes(arg))
    // Show help if there's no input and no arguments provided
    || args.length === 0 && stdin === '') {
    return help(terminalColors)
  }

  // path is the first param that doesn't start with -- and isn't one
  // of the existing flags
  const pathParam = args.find(arg => {
    if (arg == formatAsJson) return false
    if (helpArgs.includes(arg)) return false
    if (arg.startsWith('--')) return false
    return true
  })
  const css = pathParam ? await readFile(pathParam) : stdin

  if (!css) {
    return help(terminalColors)
  }

  const stats = analyze(css)
  delete stats.__meta__

  // Format as JSON if user asked for it
  if (args.some(arg => arg === formatAsJson)) {
    return JSON.stringify(stats)
  }

  return Analytics(stats, terminalColors)
}