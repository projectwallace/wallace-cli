const React = require('react')
const importJsx = require('import-jsx')
const {Table, RowSpan, Caption, Tr, Th} = importJsx('./Table')
const {Yellow, Dim} = importJsx('./Colors')
const {FormatInteger, FormatPercentage, FormatBytes} = require('./Formatters')

const Performance = ({stats}) => (
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
			<FormatInteger value={stats['rules.empty.total']} />
			<Yellow>
				<FormatPercentage
					fraction={stats['rules.empty.total'] / stats['rules.total']}
				/>
			</Yellow>
		</Tr>

		<Tr>
			<RowSpan>@import rules</RowSpan>
			<FormatInteger value={stats['atrules.imports.total']} />
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
