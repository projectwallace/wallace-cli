import { readFileSync } from 'fs'
import pc from 'picocolors'
import * as path from 'path'
import { analyze } from '@projectwallace/css-analyzer'
import getStdin from 'get-stdin'
import { help } from './help.js'

function formatNumber(number, { decimals = 3 } = {}) {
  return Number.isInteger(number)
    ? new Intl.NumberFormat().format(number)
    : number === 0 ? 0 : parseFloat(number).toFixed(decimals);
}

function percentage(number) {
  return String(parseFloat(number * 100).toFixed(1)) + '%'
}

const columns = [19, 12, 12, 12]
const width = columns.reduce((total, num) => (total += num), 0) + columns.length

function strLength(str) {
  // Basically strip ansi-characters from the string
  // source: https://github.com/usmanyunusov/nanospinner/blob/a80396e2f2613462399d39e664a690ec31a0da3f/index.js#L9
  return str
    .replace(/\u001b[^m]*?m/g, '')
    .length
}

function padEnd(str, padLength, padString) {
  const length = strLength(str)
  return str + ''.padEnd(padLength - length, padString)
}

function padStart(str, padLength, padString) {
  const length = strLength(str)
  return ''.padStart(padLength - length, padString) + str
}

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
      pc.bold(formatNumber(stats.stylesheet.sourceLinesOfCode).padEnd('Lines of Code'.length)),
      pc.bold(formatNumber(stats.stylesheet.size).padEnd('Filesize'.length)),
      pc.bold(formatNumber(stats.rules.total).padEnd('Rules'.length)),
      pc.bold(formatNumber(stats.selectors.total).padEnd('Selectors'.length)),
      pc.bold(formatNumber(stats.declarations.total).padEnd('Declarations'.length)),
    ].join(pc.dim(' │ ')),
    Hr(),
  ].join('\n')
}

function Rules(stats) {
  return [
    Row(
      pc.underline('Rulesets'),
      pc.dim('Most common'),
      pc.dim('Average'),
      pc.dim('Maximum'),
    ),
    Row(
      `Selectors / rule`,
      formatNumber(stats.rules.selectors.mode),
      formatNumber(stats.rules.selectors.mean),
      formatNumber(stats.rules.selectors.max),
    ),
    Row(
      `Declarations / rule`,
      formatNumber(stats.rules.declarations.mode),
      formatNumber(stats.rules.declarations.mean),
      formatNumber(stats.rules.declarations.max),
    ),
  ].join('\n')
}

function Selectors(stats) {
  return [
    Row(
      pc.underline('Selectors'),
      pc.dim('Most common'),
      pc.dim('Average'),
      pc.dim('Maximum'),
    ),
    Row(
      'Complexity',
      formatNumber(stats.selectors.complexity.mode),
      formatNumber(stats.selectors.complexity.mean),
      formatNumber(stats.selectors.complexity.max),
    ),
    Row(
      'Specificity',
      stats.selectors.specificity.mode.join(pc.dim('/')),
      stats.selectors.specificity.mean
        .map(n => formatNumber(n, { decimals: 1 }))
        .join(pc.dim('/')),
      stats.selectors.specificity.max.join(pc.dim('/'))
    ),
  ].join('\n')
}

function AtRules(stats) {
  return [
    Row(
      pc.underline('AtRules'),
      pc.dim('Total'),
      pc.dim('Unique'),
      pc.dim('Unique %'),
    ),
    Row(
      '@media',
      formatNumber(stats.atrules.media.total),
      formatNumber(stats.atrules.media.totalUnique),
      percentage(stats.atrules.media.uniquenessRatio),
    ),
    Row(
      '@supports',
      formatNumber(stats.atrules.supports.total),
      formatNumber(stats.atrules.supports.totalUnique),
      percentage(stats.atrules.supports.uniquenessRatio),
    ),
    Row(
      '@font-face',
      formatNumber(stats.atrules.fontface.total),
      formatNumber(stats.atrules.fontface.totalUnique),
      percentage(stats.atrules.fontface.uniquenessRatio),
    ),
    Row(
      '@import',
      formatNumber(stats.atrules.import.total),
      formatNumber(stats.atrules.import.totalUnique),
      percentage(stats.atrules.import.uniquenessRatio),
    ),
    Row(
      '@keyframes',
      formatNumber(stats.atrules.keyframes.total),
      formatNumber(stats.atrules.keyframes.totalUnique),
      percentage(stats.atrules.keyframes.uniquenessRatio),
    ),
    Row(
      '@container',
      formatNumber(stats.atrules.container.total),
      formatNumber(stats.atrules.container.totalUnique),
      percentage(stats.atrules.container.uniquenessRatio),
    ),
  ].join('\n')
}

function Declarations(stats) {
  return [
    Row(
      pc.underline('Declarations'),
      pc.dim('Total'),
      pc.dim('Unique'),
      pc.dim('Unique %'),
    ),
    Row(
      'Declarations',
      formatNumber(stats.declarations.total),
      formatNumber(stats.declarations.unique.total),
      percentage(stats.declarations.unique.ratio),
    ),
    Row(
      '!important',
      formatNumber(stats.declarations.importants.total),
    )
  ].join('\n')
}

function Values(stats) {
  function ValueRow(title, total, totalUnique, uniquenessRatio) {
    return Row(
      title,
      formatNumber(total),
      formatNumber(totalUnique),
      percentage(uniquenessRatio),
    )
  }
  const {
    colors, fontSizes, fontFamilies, textShadows, boxShadows, zindexes
  } = stats.values

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

function Analytics(stats) {
  return [
    Summary(stats),
    Row(),
    Rules(stats),
    Row(),
    Selectors(stats),
    Row(),
    AtRules(stats),
    Row(),
    Declarations(stats),
    Row(),
    Values(stats),
  ].join('\n')
}

function readFile(pathParam) {
  return new Promise((resolve, reject) => {
    try {
      const pathName = path.join(process.cwd(), pathParam)
      resolve(readFileSync(pathName, 'utf-8'))
    } catch (error) {
      process.exitCode = 1
      console.error(`Cannot read input file at '${pathParam}'`)
      reject(error)
    }
  })
}

async function main() {
  const args = process.argv.slice(2)
  const stdIn = await getStdin()
  const jsonFormats = ['--format=json', '--json']
  const helpArgs = ['-h', '--help']

  // Show help if the user explicitly asked for it
  if (args.some(arg => helpArgs.includes(arg))) {
    return console.log(help())
  }

  if (stdIn === '' && process.env.isTTY) {
    return console.log(help())
  }

  // Show help if there's no input and no arguments provided
  if (args.length === 0 && stdIn === '') {
    return console.log(help())
  }

  const pathParam = args.find(arg => !jsonFormats.includes(arg) && !helpArgs.includes(arg))
  const css = pathParam ? await readFile(pathParam) : stdIn
  const stats = analyze(css)

  // Format as JSON is user asked for it
  if (args.some(arg => jsonFormats.includes(arg))) {
    console.log(JSON.stringify(stats, null, 2))
    return
  }

  console.log(Analytics(stats))
}

main()
  .catch(error => {
    process.exitCode = 1
    console.error(error)
  })
