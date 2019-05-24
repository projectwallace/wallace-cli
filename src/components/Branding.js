const React = require('react')
const importJsx = require('import-jsx')
const {Box, Color} = require('ink')
const {Table, Th, RowSpan, Caption, Tr, Td} = importJsx('./Table')
const {Yellow, Dim} = importJsx('./Colors')
const {FormatInteger, FormatPercentage} = require('./Formatters')
const ValuesList = importJsx('./ValuesList')
const tinycolor = require('tinycolor2')

const BrandRow = ({name, id, stats}) => (
	<Tr>
		<RowSpan>{name}</RowSpan>
		<FormatInteger value={stats[`${id}.total`]} />
		<Yellow>
			<FormatInteger value={stats[`${id}.totalUnique`]} />
		</Yellow>
		<Dim>
			<FormatPercentage
				fraction={stats[`${id}.totalUnique`] / stats[`${id}.total`]}
			/>
		</Dim>
	</Tr>
)

const Branding = ({stats, verbose}) => (
	<Table>
		<Caption>Branding</Caption>

		<Tr>
			<React.Fragment />
			<Th>Total</Th>
			<Th>Unique</Th>
			<Th>Unique %</Th>
		</Tr>

		<BrandRow stats={stats} name="Font-sizes" id="values.fontsizes" />
		{verbose && (
			<Td>
				<ValuesList values={stats['values.fontsizes.unique']} />
			</Td>
		)}

		<BrandRow stats={stats} name="Font-families" id="values.fontfamilies" />
		{verbose && (
			<Td>
				<ValuesList values={stats['values.fontfamilies.unique']} />
			</Td>
		)}

		<BrandRow stats={stats} name="Box-shadows" id="values.boxshadows" />
		{verbose && (
			<Td>
				<ValuesList values={stats['values.boxshadows.unique']} />
			</Td>
		)}

		<BrandRow stats={stats} name="Colors" id="values.colors" />
		{verbose && (
			<Td>
				<Box flexDirection="column">
					{stats['values.colors.unique'].map(color => (
						<Box key={color.value}>
							<Box width={6} marginRight={2} justifyContent="flex-end">
								<Box>
									<Dim>
										{color.count}
										{' x'}
									</Dim>
								</Box>
							</Box>
							<Box marginRight={2}>
								<Color hex={tinycolor(color.value).toHexString()}>■</Color>
							</Box>
							<Box>{color.value}️</Box>
						</Box>
					))}
				</Box>
			</Td>
		)}

		<BrandRow stats={stats} name="@keyframes" id="atrules.keyframes" />
		{verbose && (
			<Td>
				<ValuesList values={stats['atrules.keyframes.unique']} />
			</Td>
		)}
	</Table>
)

module.exports = Branding
