/**
 * Standard Framework Logger
 *
 * @module @zefish/standard/logger
 * @category Astro Integration
 * @description Centralized logging system for Standard Framework with color
 * support and verbosity control. Provides consistent, branded log messages
 * throughout the plugin with debug-level filtering.
 *
 * @param {object} options Configuration options
 * @param {boolean} options.verbose Enable verbose logging (default: false)
 * @param {string} options.scope Optional namespace for log messages
 *
 * @returns {object} Logger instance with methods: info, success, warn, error, debug, banner
 *
 * @example
 * import logger from '@zefish/standard/logger';
 *
 * const log = logger({ verbose: true, scope: 'Markdown' });
 * log.info('Processing markdown files...');
 * log.success('Compiled 42 files');
 * log.warn('Missing frontmatter in post.md');
 * log.error('Failed to parse YAML', error);
 * log.debug('Raw block data:', blockData); // Only shows if verbose: true
 * log.banner('0.18.0', 'https://standard.ffp.co');
 *
 * @since 0.11.0
 */

/**
 * ANSI Color Codes
 *
 * In 1970, the ANSI X3.64 standard defined escape sequences for controlling
 * terminal displays. These special character sequences (starting with \x1b)
 * tell terminals to change text color, move the cursor, clear lines, and more.
 * Despite being 50+ years old, they still power modern terminal UIs—including
 * npm's colored output, git's diff highlighting, and this logger's output.
 *
 * We use them here to make build output scannable. Grey for metadata, cyan for
 * labels, green for success, red for errors. Your eyes can instantly spot what
 * matters without reading every word.
 *
 * @link https://en.wikipedia.org/wiki/ANSI_escape_code ANSI Escape Codes
 */

// Helpers: 24-bit (truecolor)
const rgb = (r, g, b) => `\x1b[38;2;${r};${g};${b}m`;
const bgRgb = (r, g, b) => `\x1b[48;2;${r};${g};${b}m`;

// Canonical sRGB values for common colors
const RGB = {
  black: { r: 0, g: 0, b: 0 }, // #000000
  white: { r: 255, g: 255, b: 255 }, // #FFFFFF
  grey: { r: 128, g: 128, b: 128 }, // #808080
  red: { r: 255, g: 0, b: 0 }, // #FF0000
  green: { r: 0, g: 128, b: 0 }, // #008000
  blue: { r: 0, g: 0, b: 255 }, // #0000FF
  yellow: { r: 255, g: 255, b: 0 }, // #FFFF00
  magenta: { r: 255, g: 0, b: 255 }, // #FF00FF
  cyan: { r: 0, g: 255, b: 255 }, // #00FFFF

  // Extended
  orange: { r: 255, g: 165, b: 0 }, // #FFA500
  purple: { r: 128, g: 0, b: 128 }, // #800080
  teal: { r: 0, g: 128, b: 128 }, // #008080
  pink: { r: 255, g: 192, b: 203 }, // #FFC0CB
  lime: { r: 0, g: 255, b: 0 }, // #00FF00
  navy: { r: 0, g: 0, b: 128 }, // #000080
  maroon: { r: 128, g: 0, b: 0 }, // #800000
  olive: { r: 128, g: 128, b: 0 }, // #808000
  silver: { r: 192, g: 192, b: 192 }, // #C0C0C0
  brown: { r: 165, g: 42, b: 42 }, // #A52A2A
  gold: { r: 255, g: 215, b: 0 }, // #FFD700
  indigo: { r: 75, g: 0, b: 130 }, // #4B0082
  violet: { r: 238, g: 130, b: 238 }, // #EE82EE
  sky: { r: 135, g: 206, b: 235 }, // #87CEEB
  coral: { r: 255, g: 127, b: 80 }, // #FF7F50
  salmon: { r: 250, g: 128, b: 114 }, // #FA8072
  khaki: { r: 240, g: 230, b: 140 }, // #F0E68C
  orchid: { r: 218, g: 112, b: 214 }, // #DA70D6
};

// Native 16-color ANSI (foreground) and their background counterparts
const ANSI16 = {
  reset: "\x1b[0m",
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[97m",
  grey: "\x1b[90m",
};

const BG_ANSI16 = {
  black: "\x1b[40m",
  red: "\x1b[41m",
  green: "\x1b[42m",
  yellow: "\x1b[43m",
  blue: "\x1b[44m",
  magenta: "\x1b[45m",
  cyan: "\x1b[46m",
  white: "\x1b[107m",
  grey: "\x1b[100m",
};

// Build palette that prefers ANSI16 for standard names, otherwise falls back to RGB
const colors = Object.fromEntries(
  Object.entries(RGB).map(([name, { r, g, b }]) => {
    const hasAnsi16 = ANSI16[name] !== undefined;
    return [
      name,
      {
        rgb: { r, g, b },
        fg: hasAnsi16 ? ANSI16[name] : rgb(r, g, b),
        bg: hasAnsi16 ? BG_ANSI16[name] : bgRgb(r, g, b),
        fg24: rgb(r, g, b),
        bg24: bgRgb(r, g, b),
      },
    ];
  }),
);

// Add reset
colors.reset = ANSI16.reset;

/**
 * Create a logger instance
 *
 * @param {Object} options - Configuration options
 * @param {boolean} options.verbose - Enable verbose/debug logging (default: false)
 * @param {string} options.scope - Optional namespace/scope for log messages
 * @returns {Object} Logger instance
 */
function logger(options = {}) {
  const { verbose = false, scope = null } = options;

  const prefix = `${colors.reset}stdn${colors.orange.fg}::${colors.reset}gd${colors.reset}`;
  // Close cyan after the scope label to avoid color bleed
  const scopeText = scope ? `${colors.blue.fg}[${scope}]${colors.reset}` : "";

  function format(level, ...args) {
    const parts = [prefix];
    if (scopeText) parts.push(scopeText);
    if (level) parts.push(level);
    return [parts.join(" "), ...args];
  }

  return {
    /**
     * Log informational message
     * @param {...any} args - Arguments to log
     */
    info(...args) {
      //console.log(...format(`${colors.blue.fg}ℹ${colors.reset}`, ...args));
      console.log(...format(``, ...args));
    },

    /**
     * Log success message
     * @param {...any} args - Arguments to log
     */
    success(...args) {
      console.log(...format(`${colors.green.fg}✓`, ...args, `${colors.reset}`));
    },

    /**
     * Log warning message
     * @param {...any} args - Arguments to log
     */
    warn(...args) {
      console.warn(
        `${prefix} ${colors.orange.fg}[${scope}] ⚠`,
        ...args,
        `${colors.reset}`,
      );
    },

    /**
     * Log error message
     * @param {...any} args - Arguments to log
     */
    error(...args) {
      console.error(
        `${prefix} ${colors.red.fg}[${scope}] ${colors.red.bg}⚠${colors.reset}${colors.red.fg}`,
        ...args,
        `${colors.reset}`,
      );
    },

    /**
     * Log debug message (only shown if verbose is enabled)
     * @param {...any} args - Arguments to log
     */
    debug(...args) {
      if (verbose) {
        console.log(
          ...format(`${colors.magenta.fg}⊙`, ...args, `${colors.reset}`),
        );
      }
    },

    /**
     * Log banner message (typically used for version/initialization info)
     * @param {string} version - Version string to display
     * @param {string} url - URL to display (default: https://standard.ffp.co)
     */
    banner(version, url = "https://standard.ffp.co") {
      console.log(
        `${prefix} ${colors.reset}:: ${colors.green.fg}v${version}${colors.reset} :: ${colors.yellow.fg}${url}${colors.reset}`,
      );
    },
  };
}

export default logger;
