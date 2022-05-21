const { toNumber, toPercentage, padEnd, padStart } = require('./formatters.js')

const columns = [19, 12, 12, 12]
const width = columns.reduce((total, num) => (total += num), 0) + columns.length

exports.Analytics = function Analytics(stats, pc) {
  function Row(...tds) {
    return tds.map((td, index) => {
      if (index === 0) {
        return padEnd(String(td), columns[index])
      }
      return padStart(String(td), columns[index])
    }).join(' ')
  }

  function Hr() {
    return pc.dim(''.padEnd(width, '─'))
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
      ].join(pc.dim(' │ ')),
      [
        pc.bold(toNumber(stats.stylesheet.sourceLinesOfCode).padEnd('Lines of Code'.length)),
        pc.bold(toNumber(stats.stylesheet.size).padEnd('Filesize'.length)),
        pc.bold(toNumber(stats.rules.total).padEnd('Rules'.length)),
        pc.bold(toNumber(stats.selectors.total).padEnd('Selectors'.length)),
        pc.bold(toNumber(stats.declarations.total).padEnd('Declarations'.length)),
      ].join(pc.dim(' │ ')),
      Hr(),
    ].join('\n')
  }

  function Rules(rules) {
    return [
      Row(
        pc.underline('Rulesets'),
        pc.dim('Most common'),
        pc.dim('Average'),
        pc.dim('Maximum'),
      ),
      Row(
        `Selectors / rule`,
        toNumber(rules.selectors.mode),
        toNumber(rules.selectors.mean),
        toNumber(rules.selectors.max),
      ),
      Row(
        `Declarations / rule`,
        toNumber(rules.declarations.mode),
        toNumber(rules.declarations.mean),
        toNumber(rules.declarations.max),
      ),
    ].join('\n')
  }

  function Selectors(selectors) {
    return [
      Row(
        pc.underline('Selectors'),
        pc.dim('Most common'),
        pc.dim('Average'),
        pc.dim('Maximum'),
      ),
      Row(
        'Complexity',
        toNumber(selectors.complexity.mode),
        toNumber(selectors.complexity.mean),
        toNumber(selectors.complexity.max),
      ),
      Row(
        'Specificity',
        selectors.specificity.mode.join(pc.dim('/')),
        selectors.specificity.mean
          .map(n => toNumber(n, { decimals: 1 }))
          .join(pc.dim('/')),
        selectors.specificity.max.join(pc.dim('/'))
      ),
    ].join('\n')
  }

  function AtRules(atrules) {
    const { media, supports, fontface, import: imports, keyframes, container } = atrules

    return [
      Row(
        pc.underline('AtRules'),
        pc.dim('Total'),
        pc.dim('Unique'),
        pc.dim('Unique %'),
      ),
      Row(
        '@media',
        toNumber(media.total),
        toNumber(media.totalUnique),
        toPercentage(media.uniquenessRatio),
      ),
      Row(
        '@supports',
        toNumber(supports.total),
        toNumber(supports.totalUnique),
        toPercentage(supports.uniquenessRatio),
      ),
      Row(
        '@font-face',
        toNumber(fontface.total),
        toNumber(fontface.totalUnique),
        toPercentage(fontface.uniquenessRatio),
      ),
      Row(
        '@import',
        toNumber(imports.total),
        toNumber(imports.totalUnique),
        toPercentage(imports.uniquenessRatio),
      ),
      Row(
        '@keyframes',
        toNumber(keyframes.total),
        toNumber(keyframes.totalUnique),
        toPercentage(keyframes.uniquenessRatio),
      ),
      Row(
        '@container',
        toNumber(container.total),
        toNumber(container.totalUnique),
        toPercentage(container.uniquenessRatio),
      ),
    ].join('\n')
  }

  function Declarations(declarations) {
    return [
      Row(
        pc.underline('Declarations'),
        pc.dim('Total'),
        pc.dim('Unique'),
        pc.dim('Unique %'),
      ),
      Row(
        'Declarations',
        toNumber(declarations.total),
        toNumber(declarations.unique.total),
        toPercentage(declarations.unique.ratio),
      ),
      Row(
        '!important',
        toNumber(declarations.importants.total),
      )
    ].join('\n')
  }

  function Values(values) {
    function ValueRow(title, total, totalUnique, uniquenessRatio) {
      return Row(
        title,
        toNumber(total),
        toNumber(totalUnique),
        toPercentage(uniquenessRatio),
      )
    }

    const {
      colors, fontSizes, fontFamilies, textShadows, boxShadows, zindexes
    } = values

    return [
      Row(
        pc.underline('Values'),
        pc.dim('Total'),
        pc.dim('Unique'),
        pc.dim('Unique %'),
      ),
      ValueRow('Colors', colors.total, colors.totalUnique, colors.uniquenessRatio,),
      ValueRow('Font-sizes', fontSizes.total, fontSizes.totalUnique, fontSizes.uniquenessRatio,),
      ValueRow('Font-families', fontFamilies.total, fontFamilies.totalUnique, fontFamilies.uniquenessRatio,),
      ValueRow('Text-shadows', textShadows.total, textShadows.totalUnique, textShadows.uniquenessRatio,),
      ValueRow('Box-shadows', boxShadows.total, boxShadows.totalUnique, boxShadows.uniquenessRatio,),
      ValueRow('Z-indexes', zindexes.total, zindexes.totalUnique, zindexes.uniquenessRatio,),
    ].join('\n')
  }

  return [
    Summary(stats),
    Row(),
    Rules(stats.rules),
    Row(),
    Selectors(stats.selectors),
    Row(),
    AtRules(stats.atrules),
    Row(),
    Declarations(stats.declarations),
    Row(),
    Values(stats.values),
  ].join('\n')
}