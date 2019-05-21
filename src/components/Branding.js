const React = require('react')
const importJsx = require('import-jsx')
const {Table, Th, RowSpan, Caption, Tr, Td} = importJsx('./Table')
const {Yellow, Dim} = importJsx('./Colors')
const {FormatInteger, FormatPercentage} = require('./Formatters')

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

const Branding = ({stats}) => (
	<Table>
		<Caption>Branding</Caption>

		<Tr>
			<React.Fragment />
			<Th>Total</Th>
			<Th>Unique</Th>
			<Th>Unique %</Th>
		</Tr>

		<BrandRow stats={stats} name="Font-sizes" id="values.fontsizes" />
		<BrandRow stats={stats} name="Font-families" id="values.fontfamilies" />
		<BrandRow stats={stats} name="Box-shadows" id="values.boxshadows" />
		<BrandRow stats={stats} name="Colors" id="values.colors" />
		<BrandRow stats={stats} name="@media queries" id="atrules.mediaqueries" />
		<BrandRow stats={stats} name="@keyframes" id="atrules.keyframes" />
	</Table>
)

module.exports = Branding
