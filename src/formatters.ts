let number_formatter = new Intl.NumberFormat()

/**
 * Format byte size to a human readable size, like 100KB
 * @see https://www.codexworld.com/how-to/convert-file-size-bytes-kb-mb-gb-javascript/
 */
export function to_filesize(bytes: number): string {
	if (bytes == 0) return '0B'
	const sizes = ['B', 'KB', 'MB']
	const step = 1000
	const magnitude = Math.floor(Math.log(bytes) / Math.log(step))
	return parseFloat((bytes / Math.pow(step, magnitude)).toFixed(1)) + sizes[magnitude]
}

export function to_number(number: number, { decimals = 2 } = {}): string | number {
	return Number.isInteger(number)
		? number_formatter.format(number)
		: number === 0
			? 0
			: parseFloat(String(number)).toFixed(decimals)
}

export function to_percentage(number: number): string {
	return String(parseFloat(String(number * 100)).toFixed(1)) + '%'
}

export function pad_end(str: string, padLength: number, padString?: string): string {
	return str + ''.padEnd(padLength - str.length, padString)
}

export function pad_start(str: string, padLength: number, padString?: string): string {
	return ''.padStart(padLength - str.length, padString) + str
}
