import { analyze } from '@projectwallace/css-analyzer'

export type CssAnalysis = ReturnType<typeof analyze>

export type Colors = {
	bold: (str: string) => string
	dim: (str: string) => string
	underline: (str: string) => string
	italic: (str: string) => string
	red: (str: string) => string
}
