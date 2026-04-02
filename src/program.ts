import { analyze } from '@projectwallace/css-analyzer'
import { parseArgs } from 'node:util'
import { help } from './help.js'
import { Analytics } from './components.js'
export type { Colors } from './types.js'
import type { Colors, CssAnalysis } from './types.js'

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
		strict: false,
	})

	// Show help if the user explicitly asked for it or if no arguments were provided
	if (values.help || (args.length === 0 && stdin === '')) {
		return help(terminal_colors)
	}

	// Use the first positional argument as the file path
	const path_param = positionals[0]
	const css = path_param ? await read_file(path_param) : stdin

	if (!css) {
		return help(terminal_colors)
	}

	const stats = analyze(css, { useLocations: false })
	delete (stats as Record<string, unknown>).__meta__

	// Format as JSON if user asked for it
	if (values.json) {
		return JSON.stringify(stats)
	}

	// The analyze function has overloads and TypeScript's ReturnType only captures the last overload's return type,
	// making the two variants structurally incompatible for a direct cast.
	// The as unknown as CssAnalysis double assertion is the standard escape hatch for this.
	return Analytics(stats as unknown as CssAnalysis, terminal_colors)
}
