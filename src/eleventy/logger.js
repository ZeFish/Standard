/**
 * @component Logger Utility
 * @category 11ty Plugins
 * @description Centralized logging system for Standard Framework with color
 * support and verbosity control. Provides consistent, branded log messages
 * throughout the plugin with debug-level filtering.
 *
 * @param {object} options Configuration options
 * @param {boolean} options.verbose Enable verbose logging (default: false)
 * @param {string} options.scope Optional namespace for log messages
 *
 * @returns {object} Logger instance with methods: info, success, warn, error, debug
 *
 * @example
 * const logger = createLogger({ verbose: true, scope: 'Markdown' });
 * logger.info('Processing markdown files...');
 * logger.success('Compiled 42 files');
 * logger.warn('Missing frontmatter in post.md');
 * logger.error('Failed to parse YAML', error);
 * logger.debug('Raw block data:', blockData); // Only shows if verbose: true
 *
 * @since 0.11.0
 */

const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  grey: "\x1b[90m",
  white: "\x1b[97m",
};

export function createLogger(options = {}) {
  const { verbose = false, scope = null } = options;

  const prefix = `${colors.red}[ :: ] Standard${colors.reset}`;
  const scopeText = scope ? `${colors.cyan}[${scope}]${colors.reset}` : "";

  /**
   * Format log message with prefix and scope
   */
  function format(level, ...args) {
    const parts = [prefix];
    if (scopeText) parts.push(scopeText);
    if (level) parts.push(level);
    return [parts.join(" "), ...args];
  }

  return {
    /**
     * General info message (always shown)
     */
    info(...args) {
      console.log(...format(`${colors.blue}ℹ${colors.reset}`, ...args));
    },

    /**
     * Success message (always shown)
     */
    success(...args) {
      console.log(...format(`${colors.green}✓${colors.reset}`, ...args));
    },

    /**
     * Warning message (always shown)
     */
    warn(...args) {
      console.warn(...format(`${colors.yellow}⚠${colors.reset}`, ...args));
    },

    /**
     * Error message (always shown)
     */
    error(...args) {
      console.error(...format(`${colors.red}✖${colors.reset}`, ...args));
    },

    /**
     * Debug message (only shown if verbose: true)
     */
    debug(...args) {
      if (verbose) {
        console.log(...format(`${colors.grey}[debug]${colors.reset}`, ...args));
      }
    },

    /**
     * Branded startup message
     */
    banner(version, url = "https://standard.ffp.co") {
      console.log(
        `${prefix} | ${colors.reset}${version}${colors.grey} | ${colors.green}${url} ⚡⚡${colors.reset}`,
      );
    },
  };
}
