const prettyBytes = require('pretty-bytes')

const FormatInteger = ({value}) => {
	return new Intl.NumberFormat().format(value)
}

const FormatDecimal = ({value, decimals = 2}) => {
	return parseFloat(value).toFixed(decimals)
}

const FormatPercentage = ({fraction, decimals = 1}) => {
	if (isNaN(fraction)) {
		return '0.0%'
	}

	return (fraction * 100).toFixed(decimals) + '%'
}

const FormatBytes = ({bytes}) => {
	return prettyBytes(bytes)
}

exports.FormatInteger = FormatInteger
exports.FormatDecimal = FormatDecimal
exports.FormatPercentage = FormatPercentage
exports.FormatBytes = FormatBytes
