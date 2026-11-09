const number_formatter = new Intl.NumberFormat()

const byte_units = ['byte', 'kilobyte', 'megabyte'] as const

const filesize_formatters = byte_units.map(
	(unit) =>
		new Intl.NumberFormat('en-US', {
			style: 'unit',
			unit,
			unitDisplay: unit === 'byte' ? 'long' : 'short',
			maximumSignificantDigits: 3,
		}),
)

/**
 * Format byte size to a human readable size, like 100 kB
 * Sizes above 1MB stay expressed in MB.
 */
export function to_filesize(bytes: number): string {
	let size = Math.max(0, bytes)
	let index = 0
	while (size >= 1000 && index < filesize_formatters.length - 1) {
		size /= 1000
		index++
	}
	return filesize_formatters[index].format(size)
}

export function to_number(number: number, { decimals = 2 } = {}): string | number {
	if (Number.isInteger(number)) {
		return number_formatter.format(number)
	}
	if (number === 0) {
		return 0
	}
	return Number(String(number)).toFixed(decimals)
}

export function to_percentage(number: number): string {
	return String(Number(String(number * 100)).toFixed(1)) + '%'
}

export function pad_end(str: string, padLength: number, padString?: string): string {
	return str + ''.padEnd(Math.max(0, padLength - str.length), padString)
}

export function pad_start(str: string, padLength: number, padString?: string): string {
	return ''.padStart(Math.max(0, padLength - str.length), padString) + str
}
