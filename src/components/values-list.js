const React = require('react')
const {Box} = require('ink')
const importJsx = require('import-jsx')

const {Dim} = importJsx('./colors')

const ValuesList = ({values}) => {
	if (values.length === 0) {
		return (
			<Box>
				<Dim>N/A</Dim>
			</Box>
		)
	}

	return (
		<Box flexDirection="column">
			{values.map(value => (
				<Box key={value.value}>
					<Box width={6} marginRight={1} justifyContent="flex-end">
						<Box>
							<Dim>
								{value.count}
								{' ×'}
							</Dim>
						</Box>
					</Box>
					<Box>{value.value}</Box>
				</Box>
			))}
		</Box>
	)
}

module.exports = ValuesList
