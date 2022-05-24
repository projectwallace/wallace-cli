exports.help = function help(tc) {
  return `
${tc.bold('Usage')}
  ${tc.dim('$')} wallace <path-to-file>

${tc.bold('Options')}
  --json ${tc.italic('Format as JSON instead of a table')}
  --help, -h Show this help

${tc.bold('Examples')}
  # Point to a file
  ${tc.dim('$')} wallace path/to/styles.css

  # CSS via stdin
  ${tc.dim('$')} cat style.css | wallace

  # CSS from a server
  ${tc.dim('$')} curl http://localhost/css/style.css | wallace

  # Format as json
  ${tc.dim('$')} wallace path/to/styles.css --json
`.trim()
}
