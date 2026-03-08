<div align="center">
  <h1>Wallace CLI</h1>
  <p>Pretty CSS analytics in your terminal.</p>
</div>

## Installation

```sh
npm install wallace-cli
```

## Usage

```sh
Usage
  $ wallace <path-to-file>

Options
  --json Format as JSON instead of a table
  --help, -h Show this help

Examples
  # Point to a file
  $ wallace path/to/styles.css

  # CSS via stdin
  $ cat style.css | wallace

  # CSS from a server
  $ curl http://localhost/css/style.css | wallace

  # Format as json
  $ wallace path/to/styles.css --json
```

## Example output

![Example terminal output for this module](example.jpg)

## Related projects

- [Online CSS Analyzer](https://www.projectwallace.com/analyze-css) - Watch the analytics from this CLI online in a much more visual and detailed way!
- [CSS Analyzer](https://github.com/projectwallace/css-analyzer) - The analyzer that powers this module
- [CSS Code Quality Analyzer](https://github.com/projectwallace/css-code-quality) - A Code Quality analyzer that tells you how maintainable, complex and performant your CSS is
- [Format CSS](https://github.com/projectwallace/format-css) - Fast, small, zero-config library to format CSS using basic rules.
