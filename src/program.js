import { analyze } from '@projectwallace/css-analyzer'
import { parseArgs } from 'node:util'
import { help } from './help.js'
import { Analytics } from './components.js'

export async function Program({ args, read_file, terminal_colors, stdin }) {
  const options = {
    json: {
      type: 'boolean',
      short: 'j'
    },
    help: {
      type: 'boolean',
      short: 'h'
    }
  }

  const { values, positionals } = parseArgs({
    args,
    options,
    allowPositionals: true,
    strict: false
  })

  // Show help if the user explicitly asked for it or if no arguments were provided
  if (values.help || args.length === 0 && stdin === '') {
    return help(terminal_colors)
  }

  // Use the first positional argument as the file path
  const path_param = positionals[0]
  const css = path_param ? await read_file(path_param) : stdin

  if (!css) {
    return help(terminal_colors)
  }

  const stats = analyze(css)
  delete stats.__meta__

  // Format as JSON if user asked for it
  if (values.json) {
    return JSON.stringify(stats)
  }

  return Analytics(stats, terminal_colors)
}