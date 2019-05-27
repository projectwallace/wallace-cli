const React = require('react')
const {Box} = require('ink')
const importJsx = require('import-jsx')
const {FormatInteger, FormatPercentage, FormatBytes} = require('../formatters')

const {Table, RowSpan, Caption, Tr, Th, Td} = importJsx('./table')
const {Yellow, Dim, Red} = importJsx('./colors')
const ValuesList = importJsx('./values-list')

const Warning = ({children, warning}) => {
	const Component = warning ? Red : React.Fragment
	return <Component>{children}</Component>
}

const Performance = ({stats, verbose}) => (
	<Table>
		<Caption>Performance</Caption>

		<Tr>
			<Th>File size</Th>
			<Th>Bytes</Th>
			<Th>Comp. %</Th>
		</Tr>

		<Tr>
			<RowSpan>Size</RowSpan>
			<FormatBytes
				bytes={stats['stylesheets.filesize.uncompressed.totalBytes']}
			/>
		</Tr>

		<Tr>
			<RowSpan>Size gzip</RowSpan>
			<FormatBytes
				bytes={stats['stylesheets.filesize.compressed.gzip.totalBytes']}
			/>
			<Yellow>
				<FormatPercentage
					fraction={
						stats['stylesheets.filesize.compressed.gzip.compressionRatio']
					}
				/>
			</Yellow>
		</Tr>

		<Tr>
			<RowSpan>Size brotli</RowSpan>
			<FormatBytes
				bytes={stats['stylesheets.filesize.compressed.brotli.totalBytes']}
			/>
			<Yellow>
				<FormatPercentage
					fraction={
						stats['stylesheets.filesize.compressed.brotli.compressionRatio']
					}
				/>
			</Yellow>
		</Tr>

		<Tr marginTop={1}>
			<Th>Misc.</Th>
			<Th>Total</Th>
			<Th>Unique</Th>
			<Th>Unique %</Th>
		</Tr>

		<Tr>
			<RowSpan>Empty rules</RowSpan>
			<Warning warning={stats['rules.empty.total'] > 0}>
				<FormatInteger value={stats['rules.empty.total']} />
			</Warning>
			<Yellow>
				<FormatPercentage
					fraction={stats['rules.empty.total'] / stats['rules.total']}
				/>
			</Yellow>
		</Tr>

		<Tr>
			<RowSpan>@import rules</RowSpan>
			<Warning warning={stats['atrules.imports.total'] > 0}>
				<FormatInteger value={stats['atrules.imports.total']} />
			</Warning>
			<Yellow>
				<FormatInteger value={stats['atrules.imports.totalUnique']} />
			</Yellow>
			<Dim>
				<FormatPercentage
					fraction={
						stats['atrules.imports.totalUnique'] /
						stats['atrules.imports.total']
					}
				/>
			</Dim>
		</Tr>
		{verbose && (
			<Td>
				<ValuesList values={stats['atrules.imports.unique']} />
			</Td>
		)}

		<Tr>
			<RowSpan>@font-face rules</RowSpan>
			<FormatInteger value={stats['atrules.fontfaces.total']} />
			<Yellow>
				<FormatInteger value={stats['atrules.fontfaces.total']} />
			</Yellow>
			<Dim>
				<FormatPercentage
					fraction={
						stats['atrules.fontfaces.totalUnique'] /
						stats['atrules.fontfaces.total']
					}
				/>
			</Dim>
		</Tr>
		{verbose && (
			<Td>
				<Box marginBottom={1} flexDirection="column">
					{stats['atrules.fontfaces.unique'].map(fontface => (
						<Box key={fontface.value.src} flexDirection="column">
							<Dim>{'{'}</Dim>
							{Object.entries(fontface.value).map(([property, value]) => (
								<Box key={fontface.value.src + property} marginLeft={2}>
									<Box>{property}</Box>
									<Dim>: </Dim>
									<Box textWrap="truncate-middle">
										<Yellow>{value}</Yellow>
									</Box>
								</Box>
							))}
							<Dim>{'}'}</Dim>
						</Box>
					))}
				</Box>
			</Td>
		)}

		<Tr>
			<RowSpan>Color duplicates</RowSpan>
			<FormatInteger value={stats['values.colors.duplicates.total']} />
			<Yellow>
				<FormatInteger value={stats['values.colors.duplicates.totalUnique']} />
			</Yellow>
			<Dim>
				<FormatPercentage
					fraction={
						stats['values.colors.duplicates.totalUnique'] /
						stats['values.colors.duplicates.total']
					}
				/>
			</Dim>
		</Tr>
	</Table>
)

module.exports = Performance
