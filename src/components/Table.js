const React = require('react')
const {Color, Text, Box} = require('ink')

const Table = ({children}) => <React.Fragment>{children}</React.Fragment>

const Th = ({children}) => <Color dim>{children}</Color>

const RowSpan = ({children}) => (
	<Text>
		<Color dim>‣</Color> {children}
	</Text>
)

const Caption = ({children}) => (
	<Box>
		<Text bold>{children}</Text>
	</Box>
)

const Tr = ({children, marginTop}) => {
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
		<Box marginTop={marginTop}>
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
	<Box marginLeft={2} textWrap="wrap">
		{children}
	</Box>
)

exports.Table = Table
exports.Th = Th
exports.RowSpan = RowSpan
exports.Caption = Caption
exports.Tr = Tr
exports.Td = Td
