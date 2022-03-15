import pc from 'picocolors'

export function help() {
  return `
${pc.bold('Usage')}
  ${pc.dim('$')} wallace <path-to-file>

${pc.bold('Options')}
  --format ${pc.italic('Format pretty (default) or JSON')}
  --help, -h Show this help

${pc.bold('Examples')}
  # Point to a file
  ${pc.dim('$')} wallace path/to/styles.css

  # CSS via stdin
  ${pc.dim('$')} cat style.css | wallace

  # CSS from a server
  ${pc.dim('$')} curl http://localhost/css/style.css | wallace

  # Format as json
  ${pc.dim('$')} wallace path/to/styles.css --format=json
`.trim()
}
