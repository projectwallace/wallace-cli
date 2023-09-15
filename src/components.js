import { to_filesize, to_number, to_percentage, pad_end, pad_start } from './formatters.js'

const columns = [19, 12, 12, 12]
const width = columns.reduce((total, num) => (total += num), 0) + columns.length

export function Analytics(stats, style) {
  function Row(...tds) {
    return tds.map((td, index) => {
      if (index === 0) {
        return pad_end(String(td), columns[index])
      }
      return pad_start(String(td), columns[index])
    }).join(' ')
  }

  function Hr() {
    return style.dim(''.padEnd(width, '─'))
  }

  function Summary(stats) {
    return [
      Hr(),
      [
        'Lines of Code',
        'Filesize',
        'Rules',
        'Selectors',
        'Declarations',
      ].join(style.dim(' │ ')),
      [
        style.bold(to_number(stats.stylesheet.sourceLinesOfCode).padEnd('Lines of Code'.length)),
        style.bold(to_filesize(stats.stylesheet.size).padEnd('Filesize'.length)),
        style.bold(to_number(stats.rules.total).padEnd('Rules'.length)),
        style.bold(to_number(stats.selectors.total).padEnd('Selectors'.length)),
        style.bold(to_number(stats.declarations.total)),
      ].join(style.dim(' │ ')),
      Hr(),
    ].join('\n')
  }

  function Stylesheet(stylesheet) {
    return [
      Row(
        'Comments',
        to_filesize(stylesheet.comments.size),
        style.dim(`(${stylesheet.comments.total} items)`),
      ),
      Row(
        'Embedded Content',
        to_filesize(stylesheet.embeddedContent.size.total),
        style.dim(`(${stylesheet.embeddedContent.total} items)`)
      )
    ].join('\n')
  }

  function Rules(rules) {
    let empty_count = to_number(rules.empty.total)
    return [
      Row(
        style.underline('Rulesets'),
        style.dim('Most common'),
        style.dim('Average'),
        style.dim('Maximum'),
      ),
      Row(
        `Selectors / rule`,
        to_number(rules.selectors.mode),
        to_number(rules.selectors.mean),
        to_number(rules.selectors.max),
      ),
      Row(
        `Declarations / rule`,
        to_number(rules.declarations.mode),
        to_number(rules.declarations.mean),
        to_number(rules.declarations.max),
      ),
      Row(
        `Empty rules`,
        '',
        '',
        rules.empty.total > 0 ? style.red(empty_count) : empty_count
      )
    ].join('\n')
  }

  function Selectors(selectors) {
    return [
      Row(
        style.underline('Selectors'),
        style.dim('Most common'),
        style.dim('Average'),
        style.dim('Maximum'),
      ),
      Row(
        'Complexity',
        to_number(selectors.complexity.mode),
        to_number(selectors.complexity.mean),
        to_number(selectors.complexity.max),
      ),
      Row(
        'Specificity',
        selectors.specificity.mode.join(style.dim('/')),
        selectors.specificity.mean
          .map(n => to_number(n, { decimals: 1 }))
          .join(style.dim('/')),
        selectors.specificity.max.join(style.dim('/'))
      ),
      Row(),
      Row(
        '',
        style.dim('Total'),
        style.dim('Unique'),
        style.dim('Ratio'),
      ),
      Row(
        `All Selectors`,
        to_number(selectors.total),
        to_number(selectors.totalUnique),
        to_percentage(selectors.uniquenessRatio),
      ),
      Row(
        `ID Selectors`,
        to_number(selectors.id.total),
        to_number(selectors.id.totalUnique),
        to_percentage(selectors.id.uniquenessRatio),
      ),
      Row(
        `Accessibility`,
        to_number(selectors.accessibility.total),
        to_number(selectors.accessibility.totalUnique),
        to_percentage(selectors.accessibility.uniquenessRatio),
      ),
      Row(
        `Vendor prefixed`,
        to_number(selectors.prefixed.total),
        to_number(selectors.prefixed.totalUnique),
        to_percentage(selectors.prefixed.uniquenessRatio),
      ),
    ].join('\n')
  }

  function AtRules(atrules) {
    const { media, supports, fontface, import: imports, keyframes, container, property } = atrules

    return [
      Row(
        style.underline('AtRules'),
        style.dim('Total'),
        style.dim('Unique'),
        style.dim('Unique %'),
      ),
      Row(
        '@media',
        to_number(media.total),
        to_number(media.totalUnique),
        to_percentage(media.uniquenessRatio),
      ),
      Row(
        '@supports',
        to_number(supports.total),
        to_number(supports.totalUnique),
        to_percentage(supports.uniquenessRatio),
      ),
      Row(
        '@font-face',
        to_number(fontface.total),
        to_number(fontface.totalUnique),
        to_percentage(fontface.uniquenessRatio),
      ),
      Row(
        '@import',
        to_number(imports.total),
        to_number(imports.totalUnique),
        to_percentage(imports.uniquenessRatio),
      ),
      Row(
        '@keyframes',
        to_number(keyframes.total),
        to_number(keyframes.totalUnique),
        to_percentage(keyframes.uniquenessRatio),
      ),
      Row(
        '@container',
        to_number(container.total),
        to_number(container.totalUnique),
        to_percentage(container.uniquenessRatio),
      ),
      Row(
        '@property',
        to_number(property.total),
        to_number(property.totalUnique),
        to_percentage(property.uniquenessRatio),
      ),
    ].join('\n')
  }

  function Declarations(declarations, properties) {
    return [
      Row(
        style.underline('Declarations'),
        style.dim('Total'),
        style.dim('Unique'),
        style.dim('Unique %'),
      ),
      Row(
        'All Declarations',
        to_number(declarations.total),
        to_number(declarations.unique.total),
        to_percentage(declarations.unique.ratio),
      ),
      Row(
        '!important',
        to_number(declarations.importants.total),
      ),
    ].join('\n')
  }

  function Properties(properties) {
    return [
      Row(
        style.underline('Properties'),
        style.dim('Total'),
        style.dim('Unique'),
        style.dim('Unique %'),
      ),
      Row(
        'All Properties',
        to_number(properties.total),
        to_number(properties.totalUnique),
        to_percentage(properties.uniquenessRatio)
      ),
      Row(
        'Custom Properties',
        to_number(properties.custom.total),
        to_number(properties.custom.totalUnique),
        to_percentage(properties.custom.uniquenessRatio)
      ),
      Row(
        'Vendor Prefixed',
        to_number(properties.prefixed.total),
        to_number(properties.prefixed.totalUnique),
        to_percentage(properties.prefixed.uniquenessRatio)
      ),
      Row(
        'Browserhacks',
        to_number(properties.browserhacks.total),
        to_number(properties.browserhacks.totalUnique),
        to_percentage(properties.browserhacks.uniquenessRatio)
      ),
    ].join('\n')
  }

  function Values(values) {
    function ValueRow(title, total, totalUnique, uniquenessRatio) {
      return Row(
        title,
        to_number(total),
        to_number(totalUnique),
        to_percentage(uniquenessRatio),
      )
    }

    const {
      colors, gradients, fontSizes, fontFamilies, lineHeights, textShadows, boxShadows, zindexes, prefixes, browserhacks, units,
    } = values

    return [
      Row(
        style.underline('Values'),
        style.dim('Total'),
        style.dim('Unique'),
        style.dim('Unique %'),
      ),
      ValueRow('Colors', colors.total, colors.totalUnique, colors.uniquenessRatio),
      ValueRow('Gradients', gradients.total, gradients.totalUnique, gradients.uniquenessRatio),
      ValueRow('Font-sizes', fontSizes.total, fontSizes.totalUnique, fontSizes.uniquenessRatio),
      ValueRow('Font-families', fontFamilies.total, fontFamilies.totalUnique, fontFamilies.uniquenessRatio),
      ValueRow('Line-heights', lineHeights.total, lineHeights.totalUnique, lineHeights.uniquenessRatio),
      ValueRow('Text-shadows', textShadows.total, textShadows.totalUnique, textShadows.uniquenessRatio),
      ValueRow('Box-shadows', boxShadows.total, boxShadows.totalUnique, boxShadows.uniquenessRatio),
      ValueRow('Z-indexes', zindexes.total, zindexes.totalUnique, zindexes.uniquenessRatio),

      ValueRow('Vendor Prefixed', prefixes.total, prefixes.totalUnique, prefixes.uniquenessRatio),
      ValueRow('Browserhacks', browserhacks.total, browserhacks.totalUnique, browserhacks.uniquenessRatio),
      ValueRow('Units', units.total, units.totalUnique, units.uniquenessRatio),
    ].join('\n')
  }

  return [
    Summary(stats),
    Row(),
    Stylesheet(stats.stylesheet),
    Row(),
    Rules(stats.rules),
    Row(),
    Selectors(stats.selectors),
    Row(),
    AtRules(stats.atrules),
    Row(),
    Declarations(stats.declarations),
    Row(),
    Properties(stats.properties),
    Row(),
    Values(stats.values),
  ].join('\n')
}