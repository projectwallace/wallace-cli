const React = require('react')
const {Color, Text, Box} = require('ink')
const importJsx = require('import-jsx')

const {Dim} = importJsx('./colors')

const Table = ({children}) => <React.Fragment>{children}</React.Fragment>

const Th = ({children}) => <Color dim>{children}</Color>

const RowSpan = ({children}) => (
	<Text>
		<Color dim>‣ </Color>
		<Text bold>{children}</Text>
	</Text>
)

const Caption = ({children}) => (
	<Box flexDirection="column">
		<Text bold>{children}</Text>
		<Dim>{new Array(52).fill('-')}</Dim>
	</Box>
)

const Tr = ({children, marginTop, marginBottom}) => {
	const columns = [
		{
			width: 20,
			margin: 3,
			align: 'flex-start'
		},
		{
			width: 8,
			margin: 3,
			align: 'flex-end'
		},
		{
			width: 7,
			margin: 3,
			align: 'flex-end'
		},
		{
			width: 8,
			margin: 0,
			align: 'flex-end'
		}
	]

	return (
		<Box marginTop={marginTop} marginBottom={marginBottom}>
			{React.Children.map(children, (child, index) => {
				const {width, margin, align} = columns[index]
				return (
					<Box width={width} marginRight={margin} justifyContent={align}>
						<Box textWrap="wrap">{child}</Box>
					</Box>
				)
			})}
		</Box>
	)
}

const Td = ({children}) => (
	<Box marginLeft={2} marginBottom={1} textWrap="wrap">
		{children}
	</Box>
)

exports.Table = Table
exports.Th = Th
exports.RowSpan = RowSpan
exports.Caption = Caption
exports.Tr = Tr
exports.Td = Td
