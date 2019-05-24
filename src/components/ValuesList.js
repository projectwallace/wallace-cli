const React = require('react')
const {Box} = require('ink')
const importJsx = require('import-jsx')
const {Dim} = importJsx('./Colors')

const ValuesList = ({values}) =>
	values.length > 0 ? (
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
	) : (
		<Box>
			<Dim>N/A</Dim>
		</Box>
	)

module.exports = ValuesList
