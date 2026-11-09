import { parseArgs } from 'node:util'
import { analyze_css } from './analyze.ts'
import { help } from './help.ts'
import { Analytics } from './components.ts'
import type { Colors } from './types.ts'

type ProgramOptions = {
	args: string[]
	read_file: (path: string) => Promise<string>
	terminal_colors: Colors
	stdin: string
}

export async function Program({
	args,
	read_file,
	terminal_colors,
	stdin,
}: ProgramOptions): Promise<string> {
	const options = {
		json: {
			type: 'boolean' as const,
			short: 'j',
		},
		help: {
			type: 'boolean' as const,
			short: 'h',
		},
	}

	const { values, positionals } = parseArgs({
		args,
		options,
		allowPositionals: true,
		strict: true,
	})

	// Show help if the user explicitly asked for it or if no arguments were provided
	if (values.help || (args.length === 0 && stdin === '')) {
		return help(terminal_colors)
	}

	// Use the first positional argument as the file path
	const path_param = positionals[0]
	const css = path_param ? await read_file(path_param) : stdin

	if (!css) {
		if (path_param) {
			throw new Error(`${path_param} is empty`)
		}
		return help(terminal_colors)
	}

	const stats = analyze_css(css)

	// Format as JSON if user asked for it
	if (values.json) {
		return JSON.stringify(stats)
	}

	return Analytics(stats, terminal_colors)
}
