import { analyze } from '@projectwallace/css-analyzer'
import { help } from './help.js'
import { Analytics } from './components.js'

export async function Program({ args, read_file, terminal_colors, stdin }) {
  const format_as_json = '--json'
  const help_args = ['-h', '--help']

  // Show help if the user explicitly asked for it
  if (args.some(arg => help_args.includes(arg))
    // Show help if there's no input and no arguments provided
    || args.length === 0 && stdin === '') {
    return help(terminal_colors)
  }

  // path is the first param that doesn't start with -- and isn't one
  // of the existing flags
  const path_param = args.find(arg => {
    if (arg == format_as_json) return false
    if (help_args.includes(arg)) return false
    if (arg.startsWith('--')) return false
    return true
  })
  const css = path_param ? await read_file(path_param) : stdin

  if (!css) {
    return help(terminal_colors)
  }

  const stats = analyze(css)
  delete stats.__meta__

  // Format as JSON if user asked for it
  if (args.some(arg => arg === format_as_json)) {
    return JSON.stringify(stats)
  }

  return Analytics(stats, terminal_colors)
}