const React = require('react')
const {Text} = require('ink')
const importJsx = require('import-jsx')
const {Table, Th, RowSpan, Caption, Tr, Td} = importJsx('./Table')
const {Yellow, Dim} = importJsx('./Colors')
const ValuesList = importJsx('./ValuesList')
const {FormatInteger, FormatPercentage} = require('./Formatters')

const Selectors = ({stats, verbose}) => (
	<Table>
		<Caption>Selectors</Caption>

		<Tr>
			<React.Fragment />
			<Th>Total</Th>
			<Th>Unique</Th>
			<Th>Unique %</Th>
		</Tr>

		<Tr>
			<RowSpan>All</RowSpan>
			<FormatInteger value={stats['selectors.total']} />
			<Yellow>
				<FormatInteger value={stats['selectors.totalUnique']} />
			</Yellow>
			<Dim>
				<FormatPercentage
					fraction={stats['selectors.totalUnique'] / stats['selectors.total']}
				/>
			</Dim>
		</Tr>

		<Tr>
			<RowSpan>#id</RowSpan>
			<FormatInteger value={stats['selectors.id.total']} />
			<Yellow>
				<FormatInteger value={stats['selectors.id.totalUnique']} />
			</Yellow>
			<Dim>
				<FormatPercentage
					fraction={
						stats['selectors.id.totalUnique'] / stats['selectors.id.total']
					}
				/>
			</Dim>
		</Tr>
		{verbose && (
			<Td>
				<ValuesList values={stats['selectors.id.unique']} />
			</Td>
		)}

		<Tr>
			<RowSpan>.js</RowSpan>
			<FormatInteger value={stats['selectors.js.total']} />
			<Yellow>
				<FormatInteger value={stats['selectors.js.totalUnique']} />
			</Yellow>
			<Dim>
				<FormatPercentage
					fraction={
						stats['selectors.js.totalUnique'] / stats['selectors.js.total']
					}
				/>
			</Dim>
		</Tr>
		{verbose && (
			<Td>
				<ValuesList values={stats['selectors.js.unique']} />
			</Td>
		)}

		<Tr>
			<RowSpan>* (universal)</RowSpan>
			<FormatInteger value={stats['selectors.universal.total']} />
			<Yellow>
				<FormatInteger value={stats['selectors.universal.totalUnique']} />
			</Yellow>
			<Dim>
				<FormatPercentage
					fraction={
						stats['selectors.universal.totalUnique'] /
						stats['selectors.universal.total']
					}
				/>
			</Dim>
		</Tr>
		{verbose && (
			<Td>
				<ValuesList values={stats['selectors.universal.unique']} />
			</Td>
		)}

		<Tr>
			<RowSpan>{'[role|aria=""]'}</RowSpan>
			<FormatInteger value={stats['selectors.accessibility.total']} />
			<Yellow>
				<FormatInteger value={stats['selectors.accessibility.totalUnique']} />
			</Yellow>
			<Dim>
				<FormatPercentage
					fraction={
						stats['selectors.accessibility.totalUnique'] /
						stats['selectors.accessibility.total']
					}
				/>
			</Dim>
		</Tr>
		{verbose && (
			<Td>
				<ValuesList values={stats['selectors.accessibility.unique']} />
			</Td>
		)}

		<Tr marginBottom={1}>
			<RowSpan>Browserh4cks</RowSpan>
			<FormatInteger value={stats['selectors.browserhacks.total']} />
			<Yellow>
				<FormatInteger value={stats['selectors.browserhacks.totalUnique']} />
			</Yellow>
			<Dim>
				<FormatPercentage
					fraction={
						stats['selectors.browserhacks.totalUnique'] /
						stats['selectors.browserhacks.total']
					}
				/>
			</Dim>
		</Tr>
		{verbose && (
			<Td>
				<ValuesList values={stats['selectors.browserhacks.unique']} />
			</Td>
		)}

		<Tr marginTop={verbose ? 0 : 1}>
			<RowSpan>Top specificity</RowSpan>
			<Text>
				{Object.values(stats['selectors.specificity.top'][0].specificity).join(
					','
				)}
			</Text>
		</Tr>
		{verbose && (
			<Td>
				<Dim>{stats['selectors.specificity.top'][0].value}</Dim>
			</Td>
		)}

		<Tr>
			<RowSpan>Top identifiers</RowSpan>
			<FormatInteger value={stats['selectors.identifiers.max.count']} />
		</Tr>
		{verbose && (
			<Td>
				<Dim>{stats['selectors.identifiers.max.value']}</Dim>
			</Td>
		)}
	</Table>
)

module.exports = Selectors
