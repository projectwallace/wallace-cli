export function help(colors) {
  return `
${colors.bold('Usage')}
  ${colors.dim('$')} wallace <path-to-file>

${colors.bold('Options')}
  --json ${colors.italic('Format as JSON instead of a table')}
  --help, -h Show this help

${colors.bold('Examples')}
  # Point to a file
  ${colors.dim('$')} wallace path/to/styles.css

  # CSS via stdin
  ${colors.dim('$')} cat style.css | wallace

  # CSS from a server
  ${colors.dim('$')} curl http://localhost/css/style.css | wallace

  # Format as json
  ${colors.dim('$')} wallace path/to/styles.css --json
`.trim()
}
