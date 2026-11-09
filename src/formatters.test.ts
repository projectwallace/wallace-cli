import { test, expect } from 'vitest'
import { to_filesize, pad_end, pad_start } from './formatters.js'

test('to_filesize', () => {
	expect(to_filesize(0)).toBe('0 bytes')
	expect(to_filesize(-5)).toBe('0 bytes')
	expect(to_filesize(1)).toBe('1 byte')
	expect(to_filesize(999)).toBe('999 bytes')
	expect(to_filesize(1500)).toBe('1.5 kB')
	expect(to_filesize(2_000_000)).toBe('2 MB')
	expect(to_filesize(3_000_000_000)).toBe('3,000 MB')
})

test('pad_end/pad_start do not throw when the string is longer than the pad length', () => {
	expect(pad_end('abcdef', 3)).toBe('abcdef')
	expect(pad_start('abcdef', 3)).toBe('abcdef')
	expect(pad_end('ab', 4)).toBe('ab  ')
	expect(pad_start('ab', 4)).toBe('  ab')
})
